import React from 'react';
import { QUIZ_BANK } from '../data/quizBank';
import { pickRandom } from '../utils/random';
import { QuizPhase } from '../components/QuizPhase';
import type { QuizQuestion } from '../components/QuizPhase';

const QUESTIONS = pickRandom(QUIZ_BANK.enigmas, 4);

export const Phase17: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <QuizPhase 
      instruction="Enigmas Textuais: Pense fora da caixa para resolver as charadas!"
      questions={QUESTIONS}
      onComplete={onComplete}
    />
  );
};
