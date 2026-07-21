import React from 'react';
import { QUIZ_BANK } from '../data/quizBank';
import { pickRandom } from '../utils/random';
import { QuizPhase } from '../components/QuizPhase';
import type { QuizQuestion } from '../components/QuizPhase';

const QUESTIONS = pickRandom(QUIZ_BANK.quizMundoReal, 5);

export const Phase14: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <QuizPhase 
      instruction="Quiz do Mundo Real: Conhecimentos Gerais!"
      questions={QUESTIONS}
      onComplete={onComplete}
    />
  );
};
