import React from 'react';
import { QUIZ_BANK } from '../data/quizBank';
import { pickRandom } from '../utils/random';
import { QuizPhase } from '../components/QuizPhase';
import type { QuizQuestion } from '../components/QuizPhase';

const QUESTIONS = pickRandom(QUIZ_BANK.cacaTesouro, 3);

export const Phase18: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <QuizPhase 
      instruction="Caça ao Tesouro: Siga a lógica para encontrar o prêmio!"
      questions={QUESTIONS}
      onComplete={onComplete}
    />
  );
};
