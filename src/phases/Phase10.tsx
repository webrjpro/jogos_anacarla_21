import React from 'react';
import { QUIZ_BANK } from '../data/quizBank';
import { pickRandom } from '../utils/random';
import { QuizPhase } from '../components/QuizPhase';
import type { QuizQuestion } from '../components/QuizPhase';

const QUESTIONS = pickRandom(QUIZ_BANK.oIntruso, 4);

export const Phase10: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <QuizPhase 
      instruction="Qual palavra NÃO pertence ao grupo?"
      questions={QUESTIONS}
      onComplete={onComplete}
    />
  );
};
