import React, { useState, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { playSound } from '../utils/audio';

const IMAGES = [
  { id: 'castle', name: 'Castelo Mágico', url: './castle.png' },
  { id: 'forest', name: 'Floresta Encantada', url: './forest.png' },
  { id: 'space', name: 'Aventura Espacial', url: './space.png' },
];

const DIFFICULTIES = [
  { id: 'easy', name: 'Fácil (9 Peças)', cols: 3, rows: 3 },
  { id: 'medium', name: 'Médio (25 Peças)', cols: 5, rows: 5 },
  { id: 'hard', name: 'Difícil (64 Peças)', cols: 8, rows: 8 },
];

interface PuzzlePiece {
  id: number;       // Which piece it IS (determines which part of the image it shows)
  slot: number;     // Which slot it is currently IN
  correctSlot: number; // Which slot it SHOULD be in (same as id)
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const Phase21: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [selectedImage, setSelectedImage] = useState<typeof IMAGES[0] | null>(null);
  const [difficulty, setDifficulty] = useState<typeof DIFFICULTIES[0] | null>(null);
  const [playing, setPlaying] = useState(false);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggedPieceId, setDraggedPieceId] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    if (!selectedImage || !difficulty) return;
    playSound.click();
    const total = difficulty.cols * difficulty.rows;
    
    // Create pieces - each piece ID maps to a section of the image
    const ids = Array.from({ length: total }, (_, i) => i);
    const shuffledIds = shuffleArray(ids);
    
    // Ensure puzzle is not already solved
    if (shuffledIds.every((id, i) => id === i)) {
      [shuffledIds[0], shuffledIds[1]] = [shuffledIds[1], shuffledIds[0]];
    }
    
    const initialPieces: PuzzlePiece[] = shuffledIds.map((pieceId, slotIndex) => ({
      id: pieceId,
      slot: slotIndex,
      correctSlot: pieceId,
    }));
    
    setPieces(initialPieces);
    setMoves(0);
    setPlaying(true);
  };

  const checkWin = useCallback((newPieces: PuzzlePiece[]) => {
    return newPieces.every(p => p.slot === p.correctSlot);
  }, []);

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    setDraggedPieceId(pieceId);
    e.dataTransfer.effectAllowed = 'move';
    // Make the drag ghost semi-transparent
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    setDraggedPieceId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSlot: number) => {
    e.preventDefault();
    if (draggedPieceId === null) return;

    const draggedPiece = pieces.find(p => p.id === draggedPieceId);
    const targetPiece = pieces.find(p => p.slot === targetSlot);
    
    if (!draggedPiece || !targetPiece || draggedPiece.id === targetPiece.id) {
      setDraggedPieceId(null);
      return;
    }

    playSound.click();
    
    // Swap slots
    const newPieces = pieces.map(p => {
      if (p.id === draggedPiece.id) return { ...p, slot: targetPiece.slot };
      if (p.id === targetPiece.id) return { ...p, slot: draggedPiece.slot };
      return p;
    });

    setPieces(newPieces);
    setMoves(m => m + 1);
    setDraggedPieceId(null);

    if (checkWin(newPieces)) {
      playSound.correct();
      setTimeout(onComplete, 800);
    }
  };

  // --- Touch Handlers for Mobile ---
  const touchPieceRef = useRef<number | null>(null);
  
  const handleTouchStart = (pieceId: number) => {
    if (touchPieceRef.current === null) {
      touchPieceRef.current = pieceId;
      setDraggedPieceId(pieceId);
      playSound.click();
    } else {
      // Second tap = swap
      const draggedPiece = pieces.find(p => p.id === touchPieceRef.current);
      const targetPiece = pieces.find(p => p.id === pieceId);
      
      if (!draggedPiece || !targetPiece || draggedPiece.id === targetPiece.id) {
        touchPieceRef.current = null;
        setDraggedPieceId(null);
        return;
      }
      
      playSound.click();
      const newPieces = pieces.map(p => {
        if (p.id === draggedPiece.id) return { ...p, slot: targetPiece.slot };
        if (p.id === targetPiece.id) return { ...p, slot: draggedPiece.slot };
        return p;
      });
      
      setPieces(newPieces);
      setMoves(m => m + 1);
      touchPieceRef.current = null;
      setDraggedPieceId(null);
      
      if (checkWin(newPieces)) {
        playSound.correct();
        setTimeout(onComplete, 800);
      }
    }
  };

  // --- Selection Screen ---
  if (!playing) {
    return (
      <div className="flex flex-col items-center justify-start w-full max-w-4xl mx-auto h-full p-2 overflow-y-auto">
        <h2 className="text-2xl sm:text-3xl font-fredoka font-bold text-magenta mb-6 text-center">
          🧩 O Grande Quebra-Cabeça
        </h2>
        
        <p className="text-white/80 mb-3 font-bold text-sm">1. Escolha uma Imagem:</p>
        <div className="grid grid-cols-3 gap-3 mb-6 w-full">
          {IMAGES.map(img => (
            <button 
              key={img.id}
              onClick={() => { setSelectedImage(img); playSound.click(); }}
              className={clsx(
                "relative rounded-xl border-4 overflow-hidden transition-all aspect-video",
                selectedImage?.id === img.id 
                  ? "border-cyan scale-105 shadow-[0_0_20px_rgba(0,229,255,0.4)]" 
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1.5 text-xs font-bold text-center">
                {img.name}
              </div>
            </button>
          ))}
        </div>

        <p className="text-white/80 mb-3 font-bold text-sm">2. Escolha a Dificuldade:</p>
        <div className="flex gap-3 w-full justify-center mb-8">
          {DIFFICULTIES.map(diff => (
            <button
              key={diff.id}
              onClick={() => { setDifficulty(diff); playSound.click(); }}
              className={clsx(
                "px-4 py-2 rounded-xl font-bold border-2 transition-all text-sm",
                difficulty?.id === diff.id 
                  ? "border-magenta bg-magenta/20 text-white shadow-[0_0_15px_rgba(224,64,251,0.3)]" 
                  : "border-white/20 text-white/60 hover:bg-white/10"
              )}
            >
              {diff.name}
            </button>
          ))}
        </div>

        <button 
          onClick={startGame}
          disabled={!selectedImage || !difficulty}
          className="btn-primary w-full max-w-md disabled:opacity-30 disabled:cursor-not-allowed"
        >
          🧩 MONTAR QUEBRA-CABEÇA
        </button>
      </div>
    );
  }

  // --- Puzzle Grid ---
  // Build a slot-indexed array so we render pieces in grid order
  const cols = difficulty!.cols;
  const rows = difficulty!.rows;
  const slotToPiece: PuzzlePiece[] = new Array(cols * rows);
  pieces.forEach(p => { slotToPiece[p.slot] = p; });

  const correctCount = pieces.filter(p => p.slot === p.correctSlot).length;
  const total = cols * rows;

  return (
    <div className="flex flex-col items-center w-full h-full p-1 sm:p-2">
      {/* Controls */}
      <div className="flex justify-between items-center w-full mb-2 shrink-0 px-1">
        <div className="text-xs sm:text-sm font-bold text-white/60">
          Movimentos: <span className="text-cyan">{moves}</span>
        </div>
        <div className="text-xs sm:text-sm font-bold text-white/60">
          Corretas: <span className="text-green">{correctCount}</span>/{total}
        </div>
        <button 
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs px-3 py-1 rounded-full border border-white/20 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          {showPreview ? '🙈 Esconder' : '👁️ Ver Imagem'}
        </button>
      </div>

      <p className="text-xs text-cyan mb-2 shrink-0">
        💡 Arraste uma peça até outra para trocar (ou toque em duas peças no celular)
      </p>

      {/* Preview overlay */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8" onClick={() => setShowPreview(false)}>
          <img src={selectedImage!.url} alt="Preview" className="max-w-full max-h-full rounded-xl border-4 border-cyan/50 shadow-2xl" />
          <p className="absolute bottom-8 text-white/50 text-sm">Clique para fechar</p>
        </div>
      )}
      
      {/* Puzzle Grid */}
      <div 
        ref={containerRef}
        className="w-full flex-1 min-h-0 bg-black/40 border-2 border-white/10 rounded-xl overflow-hidden shadow-2xl"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          aspectRatio: `${cols}/${rows}`,
          maxHeight: '100%',
        }}
      >
        {slotToPiece.map((piece, slotIndex) => {
          if (!piece) return null;
          
          // Calculate which part of the image this piece shows
          const imgCol = piece.id % cols;
          const imgRow = Math.floor(piece.id / cols);
          const isCorrect = piece.slot === piece.correctSlot;
          const isSelected = piece.id === draggedPieceId;

          return (
            <div
              key={slotIndex}
              draggable
              onDragStart={(e) => handleDragStart(e, piece.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, slotIndex)}
              onClick={() => handleTouchStart(piece.id)}
              className={clsx(
                "cursor-grab active:cursor-grabbing transition-all duration-150 relative",
                isSelected && "ring-2 ring-magenta scale-95 z-10 brightness-75",
                isCorrect && "ring-1 ring-green/40",
                !isSelected && !isCorrect && "border-[0.5px] border-black/30 hover:brightness-110"
              )}
              style={{
                backgroundImage: `url(${selectedImage!.url})`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                backgroundPosition: `${cols > 1 ? (imgCol / (cols - 1)) * 100 : 0}% ${rows > 1 ? (imgRow / (rows - 1)) * 100 : 0}%`,
              }}
            >
              {isCorrect && (
                <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-green rounded-full shadow-[0_0_6px_rgba(0,230,118,0.8)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
