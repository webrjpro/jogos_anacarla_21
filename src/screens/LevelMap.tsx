import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { PHASES } from '../data/phases';
import { Lock, CheckCircle, PlayCircle, Star } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export const LevelMap: React.FC = () => {
  const { completedPhases, phaseStars, setCurrentPhase, unlockAllPhases, resetProgress } = useGameStore();
  const totalCompleted = completedPhases.length;
  const progressPercent = (totalCompleted / 21) * 100;

  const handleDevClick = () => {
    const password = prompt("Modo Desenvolvedor: Digite a senha (ou 'reset' para apagar)");
    const normalizedPassword = password?.toLowerCase().trim();
    
    if (normalizedPassword === "415263748596") {
      unlockAllPhases();
      alert("Modo DEV ativado: Todas as fases desbloqueadas com 3 estrelas!");
    } else if (normalizedPassword === "reset") {
      resetProgress();
      useGameStore.persist.clearStorage();
      alert("Progresso apagado! O jogo está trancado novamente.");
      window.location.reload();
    } else if (password) {
      alert("Senha incorreta!");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl h-full glass-panel flex flex-col items-center justify-between overflow-hidden p-4 sm:p-6"
    >
      <div className="w-full flex justify-end px-2 pt-2 absolute top-0 right-0 z-50">
        <button 
          onClick={handleDevClick}
          className="text-[10px] font-bold text-white/10 hover:text-white/50 transition-colors uppercase px-2 py-1"
        >
          Dev
        </button>
      </div>

      <div className="w-full max-w-3xl text-center z-10 shrink-0 mt-2">
        <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan to-magenta mb-2 font-fredoka">
          🗺️ Mapa das Fases
        </h2>
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-1 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan to-green h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-white/60">
          {totalCompleted} de 21 fases completas
        </p>
      </div>

      <div className="flex-1 w-full flex items-center justify-center mt-2 min-h-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 w-full h-full max-h-full">
          {PHASES.map((phase, index) => {
            const isCompleted = completedPhases.includes(phase.id);
            const isUnlocked = index === 0 || completedPhases.includes(PHASES[index - 1].id) || isCompleted;
            const isCurrent = !isCompleted && isUnlocked;
            const stars = phaseStars[phase.id] || 0;

            return (
              <div 
                key={phase.id}
                onClick={() => isUnlocked && setCurrentPhase(phase.id)}
                className={clsx(
                  "relative p-3 rounded-xl flex flex-col items-center text-center transition-all duration-300 border border-white/10 overflow-hidden group",
                  isCompleted ? "bg-green/10 border-green/50 hover:border-green hover:shadow-[0_0_15px_rgba(0,230,118,0.3)] cursor-pointer" :
                  isCurrent ? "bg-cyan/10 border-cyan/50 hover:border-cyan hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:-translate-y-1 cursor-pointer animate-pulse-slow scale-105 z-10" :
                  "bg-white/5 opacity-50 cursor-not-allowed grayscale"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute top-2 right-2 text-white/50">
                  {isCompleted ? <CheckCircle className="text-green" size={14} /> : 
                   isUnlocked ? <PlayCircle className="text-cyan" size={14} /> : 
                   <Lock size={12} />}
                </div>

                <span className="text-2xl mb-1">{isUnlocked || isCompleted ? phase.icon : '🔒'}</span>
                
                <h3 className={clsx(
                  "text-xl font-fredoka font-bold leading-none mb-1",
                  isCompleted ? "text-green" : isCurrent ? "text-cyan" : "text-white/40"
                )}>
                  {phase.id}
                </h3>
                
                <h4 className="text-[11px] font-semibold text-white/90 mb-0.5 leading-tight line-clamp-1">{phase.name}</h4>
                
                <div className={clsx(
                  "mt-1 text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full border",
                  phase.difficulty === 'Fácil' ? "border-cyan/50 text-cyan" :
                  phase.difficulty === 'Médio' ? "border-yellow/50 text-yellow" :
                  phase.difficulty === 'Difícil' ? "border-orange/50 text-orange" :
                  "border-magenta/50 text-magenta"
                )}>
                  {phase.difficulty}
                </div>
                
                {isCompleted && (
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3].map(starNum => (
                      <Star 
                        key={starNum} 
                        size={10} 
                        className={clsx(
                          starNum <= stars ? "text-yellow fill-yellow drop-shadow-[0_0_5px_rgba(255,214,0,0.8)]" : "text-white/20"
                        )} 
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
