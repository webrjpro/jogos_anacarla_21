import React from 'react';
import { QUIZ_BANK } from '../data/quizBank';
import { pickRandom } from '../utils/random';
import { QuizPhase } from '../components/QuizPhase';
import type { QuizQuestion } from '../components/QuizPhase';

const QUESTIONS = pickRandom(QUIZ_BANK.poesiaSentimentos, 3);

export const Phase15: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <QuizPhase 
      instruction="Poesia e Sentimentos: Interprete as metáforas do texto."
      questions={QUESTIONS}
      onComplete={onComplete}
    />
  );
};
