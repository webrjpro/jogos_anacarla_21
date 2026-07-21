import React from 'react';
import { QUIZ_BANK } from '../data/quizBank';
import { pickRandom } from '../utils/random';
import { QuizPhase } from '../components/QuizPhase';
import type { QuizQuestion } from '../components/QuizPhase';

const QUESTIONS = pickRandom(QUIZ_BANK.detetiveLeitura, 3);

export const Phase11: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <QuizPhase 
      instruction="Detetive da Leitura: Leia os textos com atenção e use seu raciocínio lógico para encontrar a resposta correta."
      questions={QUESTIONS}
      onComplete={onComplete}
    />
  );
};
