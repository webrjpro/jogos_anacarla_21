import React from 'react';
import { QUIZ_BANK } from '../data/quizBank';
import { pickRandom } from '../utils/random';
import { QuizPhase } from '../components/QuizPhase';
import type { QuizQuestion } from '../components/QuizPhase';

const QUESTIONS = pickRandom(QUIZ_BANK.leituraCurta, 3);

export const Phase9: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <QuizPhase 
      instruction="Leia a pequena fábula com atenção e responda à pergunta."
      questions={QUESTIONS}
      onComplete={onComplete}
    />
  );
};
