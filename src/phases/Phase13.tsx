import React from 'react';
import { QUIZ_BANK } from '../data/quizBank';
import { pickRandom } from '../utils/random';
import { QuizPhase } from '../components/QuizPhase';
import type { QuizQuestion } from '../components/QuizPhase';

const QUESTIONS = pickRandom(QUIZ_BANK.decifrandoCodigos, 3);

export const Phase13: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <QuizPhase 
      instruction="Decifrando Códigos: Use a lógica para encontrar a resposta!"
      questions={QUESTIONS}
      onComplete={onComplete}
    />
  );
};
