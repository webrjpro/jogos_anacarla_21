import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState } from '../types/game';

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      completedPhases: [],
      phaseStars: {},
      currentPhase: 0,
      isAudioEnabled: true,
      
      completePhase: (phaseId, stars = 3) => set((state) => ({
        completedPhases: state.completedPhases.includes(phaseId) 
          ? state.completedPhases 
          : [...state.completedPhases, phaseId],
        phaseStars: {
          ...state.phaseStars,
          [phaseId]: Math.max(state.phaseStars[phaseId] || 0, stars)
        }
      })),
      
      setCurrentPhase: (phaseId) => set({ currentPhase: phaseId }),
      
      resetProgress: () => set({ completedPhases: [], phaseStars: {}, currentPhase: 0 }),

      unlockAllPhases: () => set({ 
        completedPhases: Array.from({length: 21}, (_, i) => i + 1), 
        phaseStars: Array.from({length: 21}, (_, i) => i + 1).reduce((acc, curr) => ({...acc, [curr]: 3}), {})
      }),
      
      toggleAudio: () => set((state) => ({ isAudioEnabled: !state.isAudioEnabled }))
    }),
    {
      name: 'mundo-desafios-storage',
    }
  )
);
