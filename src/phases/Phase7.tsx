import React, { useState, useEffect, useCallback, useRef } from 'react';
import { playSound } from '../utils/audio';
import clsx from 'clsx';

import { WORD_BANK } from '../data/wordBank';
const WORD_POOL = WORD_BANK.chuvapalavras;

interface FallingWord {
  id: number;
  text: string;
  x: number; // percentage from left
  y: number; // percentage from top (starts at -10, falls to 110)
  speed: number;
  typed: boolean;
}

export const Phase7: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const wordIdRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsRef = useRef<FallingWord[]>([]);
  const scoreRef = useRef(0);
  const missedRef = useRef(0);

  const TARGET_SCORE = 8;
  const MAX_MISSES = 3;

  const spawnWord = useCallback(() => {
    const text = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    const newWord: FallingWord = {
      id: wordIdRef.current++,
      text,
      x: 10 + Math.random() * 70, // 10% to 80% from left
      y: -5,
      speed: 8 + Math.random() * 6, // pixels per second (percentage)
      typed: false,
    };
    wordsRef.current = [...wordsRef.current, newWord];
    setWords([...wordsRef.current]);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = timestamp;

      // Spawn new words periodically
      spawnTimerRef.current += delta;
      if (spawnTimerRef.current > 2.2) { // Every 2.2 seconds
        spawnWord();
        spawnTimerRef.current = 0;
      }

      // Move words down
      let newMissed = 0;
      const updatedWords = wordsRef.current
        .map(w => ({ ...w, y: w.y + w.speed * delta }))
        .filter(w => {
          if (w.y > 105 && !w.typed) {
            newMissed++;
            return false;
          }
          if (w.typed && w.y > 105) return false;
          return true;
        });

      if (newMissed > 0) {
        missedRef.current += newMissed;
        setMissed(missedRef.current);
        playSound.wrong();

        if (missedRef.current >= MAX_MISSES) {
          setGameOver(true);
          return;
        }
      }

      wordsRef.current = updatedWords;
      setWords([...updatedWords]);

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Spawn first word immediately
    spawnWord();
    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameOver, spawnWord]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setInput(val);

    // Check if input matches any falling word
    const matchIndex = wordsRef.current.findIndex(
      w => !w.typed && w.text === val
    );

    if (matchIndex !== -1) {
      playSound.correct();
      wordsRef.current[matchIndex].typed = true;
      setWords([...wordsRef.current]);
      setInput('');
      
      const newScore = scoreRef.current + 1;
      scoreRef.current = newScore;
      setScore(newScore);

      if (newScore >= TARGET_SCORE) {
        cancelAnimationFrame(animFrameRef.current);
        setTimeout(onComplete, 500);
      }
    }
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-4xl font-fredoka font-bold text-red-500 mb-4">Ops! Muitas palavras escaparam!</h2>
        <p className="text-lg text-white/70 mb-8">Você acertou {scoreRef.current} de {TARGET_SCORE} palavras.</p>
        <button 
          className="btn-primary"
          onClick={() => {
            wordsRef.current = [];
            scoreRef.current = 0;
            missedRef.current = 0;
            wordIdRef.current = 0;
            lastTimeRef.current = 0;
            spawnTimerRef.current = 0;
            setWords([]);
            setScore(0);
            setMissed(0);
            setInput('');
            setGameOver(false);
          }}
        >
          TENTAR NOVAMENTE
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 shrink-0 px-2">
        <div className="text-sm font-bold">
          <span className="text-green">✅ {score}</span>
          <span className="text-white/40"> / {TARGET_SCORE}</span>
        </div>
        <p className="text-sm text-cyan font-bold">Chuva de Palavras</p>
        <div className="text-sm font-bold">
          <span className="text-white/40">Vidas: </span>
          {Array.from({ length: MAX_MISSES }).map((_, i) => (
            <span key={i} className={i < MAX_MISSES - missed ? "text-red-500" : "text-white/20"}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Rain Area */}
      <div className="flex-1 relative overflow-hidden rounded-xl bg-black/30 border border-white/10 mb-4 min-h-0">
        {/* Danger zone at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-red-500/20 to-transparent border-t border-red-500/30" />
        
        {words.map(word => (
          <div
            key={word.id}
            className={clsx(
              "absolute px-3 py-1.5 rounded-lg font-fredoka font-bold text-lg whitespace-nowrap transition-opacity duration-300",
              word.typed 
                ? "bg-green/30 text-green border border-green/50 scale-110 opacity-0" 
                : "bg-white/10 text-white border border-cyan/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
            )}
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {word.text}
          </div>
        ))}

        {words.length === 0 && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-lg font-medium animate-pulse">
            Prepare-se... as palavras estão vindo!
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3 shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Digite a palavra que está caindo..."
          className="flex-1 bg-black/40 border-2 border-white/20 rounded-xl px-6 py-3 text-xl font-fredoka uppercase text-center focus:outline-none focus:border-cyan transition-colors"
          autoFocus
        />
      </div>
    </div>
  );
};
