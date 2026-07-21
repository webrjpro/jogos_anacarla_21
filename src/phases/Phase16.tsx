import React from 'react';
import { QUIZ_BANK } from '../data/quizBank';
import { pickRandom } from '../utils/random';
import { QuizPhase } from '../components/QuizPhase';
import type { QuizQuestion } from '../components/QuizPhase';

const QUESTIONS = pickRandom(QUIZ_BANK.manualSobrevivencia, 3);

export const Phase16: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <QuizPhase 
      instruction="Manual de Sobrevivência: Leia as instruções e tome a decisão certa."
      questions={QUESTIONS}
      onComplete={onComplete}
    />
  );
};
