import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const StartScreen: React.FC = () => {
  const setCurrentPhase = useGameStore((state) => state.setCurrentPhase);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center max-w-2xl w-full"
    >
      <div className="text-yellow-300 animate-spin-slow mb-4">
        <Sparkles size={64} />
      </div>
      <h1 className="text-5xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan to-magenta drop-shadow-[0_0_25px_rgba(0,229,255,0.4)] tracking-wide leading-tight mb-8">
        Mundo dos Desafios 2.0
      </h1>
      <p className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed mb-10">
        Uma aventura épica com 21 fases desafiadoras para exercitar sua mente, expandir seu vocabulário e preparar você para o mundo real!
      </p>
      <button 
        onClick={() => setCurrentPhase(-1)}
        className="btn-primary mb-4"
      >
        INICIAR AVENTURA
      </button>

      <button 
        onClick={() => {
          if(confirm("Tem certeza que quer apagar todo o progresso da sua filha?")) {
            useGameStore.getState().resetProgress();
            useGameStore.persist.clearStorage();
            window.location.reload();
          }
        }}
        className="text-sm font-bold text-red-500/50 hover:text-red-500 underline transition-colors"
      >
        RESETAR PROGRESSO DO JOGO
      </button>
    </motion.div>
  );
};
