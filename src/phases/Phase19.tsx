import React from 'react';
import { QUIZ_BANK } from '../data/quizBank';
import { pickRandom } from '../utils/random';
import { QuizPhase } from '../components/QuizPhase';
import type { QuizQuestion } from '../components/QuizPhase';

const QUESTIONS = pickRandom(QUIZ_BANK.grandeDefesa, 3);

export const Phase19: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <QuizPhase 
      instruction="A Grande Defesa: Escolha o melhor argumento para resolver a situação!"
      questions={QUESTIONS}
      onComplete={onComplete}
    />
  );
};
