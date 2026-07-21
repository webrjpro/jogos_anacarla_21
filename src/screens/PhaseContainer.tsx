import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { ArrowLeft, Trophy } from 'lucide-react';
import { playSound } from '../utils/audio';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PHASES } from '../data/phases';

import { Phase1 } from '../phases/Phase1';
import { Phase2 } from '../phases/Phase2';
import { Phase3 } from '../phases/Phase3';
import { Phase4 } from '../phases/Phase4';
import { Phase5 } from '../phases/Phase5';
import { Phase6 } from '../phases/Phase6';
import { Phase7 } from '../phases/Phase7';
import { Phase8 } from '../phases/Phase8';
import { Phase9 } from '../phases/Phase9';
import { Phase10 } from '../phases/Phase10';
import { Phase11 } from '../phases/Phase11';
import { Phase12 } from '../phases/Phase12';
import { Phase13 } from '../phases/Phase13';
import { Phase14 } from '../phases/Phase14';
import { Phase15 } from '../phases/Phase15';
import { Phase16 } from '../phases/Phase16';
import { Phase17 } from '../phases/Phase17';
import { Phase18 } from '../phases/Phase18';
import { Phase19 } from '../phases/Phase19';
import { Phase20 } from '../phases/Phase20';
import { Phase21 } from '../phases/Phase21';

export const PhaseContainer: React.FC = () => {
  const { currentPhase, setCurrentPhase, completePhase } = useGameStore();
  const [showWin, setShowWin] = useState(false);
  const errors = useRef(0);
  const phaseData = PHASES.find(p => p.id === currentPhase);

  useEffect(() => {
    errors.current = 0;
    
    // Hack to track errors globally without changing all 20+ phases!
    const originalWrong = playSound.wrong;
    playSound.wrong = () => {
      errors.current++;
      originalWrong();
    };
    return () => {
      playSound.wrong = originalWrong;
    };
  }, [currentPhase]);

  const handlePhaseComplete = () => {
    playSound.win();
    
    // Fire Confetti!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00e5ff', '#ff00ff', '#00e676', '#ffd600'],
      zIndex: 9999
    });

    const calculatedStars = errors.current === 0 ? 3 : errors.current <= 2 ? 2 : 1;
    completePhase(currentPhase, calculatedStars);
    setShowWin(true);
  };

  const renderPhaseComponent = () => {
    switch(currentPhase) {
      case 1: return <Phase1 onComplete={handlePhaseComplete} />;
      case 2: return <Phase2 onComplete={handlePhaseComplete} />;
      case 3: return <Phase3 onComplete={handlePhaseComplete} />;
      case 4: return <Phase4 onComplete={handlePhaseComplete} />;
      case 5: return <Phase5 onComplete={handlePhaseComplete} />;
      case 6: return <Phase6 onComplete={handlePhaseComplete} />;
      case 7: return <Phase7 onComplete={handlePhaseComplete} />;
      case 8: return <Phase8 onComplete={handlePhaseComplete} />;
      case 9: return <Phase9 onComplete={handlePhaseComplete} />;
      case 10: return <Phase10 onComplete={handlePhaseComplete} />;
      case 11: return <Phase11 onComplete={handlePhaseComplete} />;
      case 12: return <Phase12 onComplete={handlePhaseComplete} />;
      case 13: return <Phase13 onComplete={handlePhaseComplete} />;
      case 14: return <Phase14 onComplete={handlePhaseComplete} />;
      case 15: return <Phase15 onComplete={handlePhaseComplete} />;
      case 16: return <Phase16 onComplete={handlePhaseComplete} />;
      case 17: return <Phase17 onComplete={handlePhaseComplete} />;
      case 18: return <Phase18 onComplete={handlePhaseComplete} />;
      case 19: return <Phase19 onComplete={handlePhaseComplete} />;
      case 20: return <Phase20 onComplete={handlePhaseComplete} />;
      case 21: return <Phase21 onComplete={handlePhaseComplete} />;
      default: 
        return <div className="text-center text-white/50">Em construção...</div>;
    }
  };

  if (showWin) {
    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="glass-panel p-12 flex flex-col items-center text-center z-50 max-w-lg w-full"
      >
        <Trophy size={80} className="text-yellow mb-6 drop-shadow-[0_0_15px_rgba(255,214,0,0.5)]" />
        <h2 className="text-4xl font-fredoka font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow to-orange mb-4">
          FASE CONCLUÍDA!
        </h2>
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(starNum => {
            const stars = errors.current === 0 ? 3 : errors.current <= 2 ? 2 : 1;
            return (
              <span key={starNum} className="text-5xl drop-shadow-md">
                {starNum <= stars ? '⭐' : '⬛'}
              </span>
            );
          })}
        </div>
        <button 
          onClick={() => setCurrentPhase(-1)}
          className="btn-primary w-full"
        >
          VOLTAR AO MAPA
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-5xl h-full glass-panel flex flex-col p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-6 shrink-0">
        <button 
          onClick={() => setCurrentPhase(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-white/80 hover:text-white"
        >
          <ArrowLeft size={18} /> <span className="hidden sm:inline">Voltar</span>
        </button>
        
        {phaseData && (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan to-magenta font-fredoka font-bold text-xs sm:text-sm shadow-md">
              FASE {phaseData.id}
            </span>
            <h2 className="text-lg sm:text-2xl font-fredoka font-bold line-clamp-1">{phaseData.name}</h2>
          </div>
        )}
        
        <div className="w-[80px]" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        {renderPhaseComponent()}
      </div>
    </motion.div>
  );
};
