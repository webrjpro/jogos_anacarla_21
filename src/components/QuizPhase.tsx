import React, { useState } from 'react';
import { playSound } from '../utils/audio';
import clsx from 'clsx';

export interface QuizQuestion {
  question: string;
  context?: string;
  options: string[];
  correctIndex: number;
}

interface QuizPhaseProps {
  instruction: string;
  questions: QuizQuestion[];
  onComplete: () => void;
}

export const QuizPhase: React.FC<QuizPhaseProps> = ({ instruction, questions, onComplete }) => {
  const [round, setRound] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const currentQ = questions[round];

  const handleOptionClick = (idx: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedIdx(idx);

    if (idx === currentQ.correctIndex) {
      playSound.correct();
      setTimeout(() => {
        if (round + 1 >= questions.length) {
          onComplete();
        } else {
          setRound(r => r + 1);
          setAnswered(false);
          setSelectedIdx(null);
        }
      }, 1200);
    } else {
      playSound.wrong();
      setTimeout(() => {
        setAnswered(false);
        setSelectedIdx(null);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto h-full">
      <div className="text-center mb-6">
        <p className="text-lg text-white/70">{instruction}</p>
      </div>

      <div className="text-sm font-semibold text-cyan mb-4">
        Pergunta {round + 1} de {questions.length}
      </div>

      {currentQ.context && (
        <div className="bg-white/5 border-l-4 border-cyan p-4 sm:p-6 rounded-r-xl mb-6 text-sm sm:text-base leading-relaxed w-full">
          {currentQ.context}
        </div>
      )}

      <div className="text-xl sm:text-2xl font-medium text-center mb-8 px-4">
        {currentQ.question}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-lg mb-auto">
        {currentQ.options.map((opt, idx) => {
          const isCorrect = answered && idx === currentQ.correctIndex;
          const isWrong = answered && selectedIdx === idx && idx !== currentQ.correctIndex;
          
          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              className={clsx(
                "p-4 rounded-xl text-left font-medium transition-all duration-300 border-2",
                isCorrect ? "bg-green/20 border-green text-green shadow-[0_0_15px_rgba(0,230,118,0.3)]" :
                isWrong ? "bg-red-500/20 border-red-500 text-red-400" :
                "bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan/50 hover:translate-x-2"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2 mt-8">
        {questions.map((_, i) => (
          <div 
            key={i} 
            className={clsx(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              i < round ? "bg-green shadow-[0_0_8px_rgba(0,230,118,0.5)]" :
              i === round ? "bg-cyan scale-125 shadow-[0_0_8px_rgba(0,229,255,0.5)]" :
              "bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  );
};
