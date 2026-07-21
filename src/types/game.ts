export interface Phase {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Mestre';
}

export interface GameState {
  completedPhases: number[];
  phaseStars: Record<number, number>;
  currentPhase: number;
  isAudioEnabled: boolean;
  completePhase: (phaseId: number, stars?: number) => void;
  setCurrentPhase: (phaseId: number) => void;
  resetProgress: () => void;
  unlockAllPhases: () => void;
  toggleAudio: () => void;
}
