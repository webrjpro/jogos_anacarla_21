import React, { useState, useEffect } from 'react';
import { QUIZ_BANK } from '../data/quizBank';
import { pickRandom } from '../utils/random';
import { playSound } from '../utils/audio';
import clsx from 'clsx';
import { Trophy, Clock } from 'lucide-react';

const CHALLENGES = pickRandom(QUIZ_BANK.desafioFinal, 4);

export const Phase20: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [round, setRound] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFailed, setIsFailed] = useState(false);

  const currentChallenge = CHALLENGES[round];

  useEffect(() => {
    if (isFailed || round >= CHALLENGES.length) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFailed(true);
          playSound.wrong();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFailed, round]);

  const handleCheck = () => {
    if (inputVal.trim().toUpperCase() === currentChallenge.answer) {
      playSound.correct();
      setInputVal('');
      if (round + 1 >= CHALLENGES.length) {
        onComplete();
      } else {
        setRound(r => r + 1);
      }
    } else {
      playSound.wrong();
      setInputVal('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCheck();
  };

  if (isFailed) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-4xl font-fredoka font-bold text-red-500 mb-4">Tempo Esgotado!</h2>
        <p className="text-lg text-white/70 mb-8">O Grande Desafio exige velocidade e precisão.</p>
        <button 
          className="btn-primary"
          onClick={() => {
            setIsFailed(false);
            setRound(0);
            setTimeLeft(60);
            setInputVal('');
          }}
        >
          TENTAR NOVAMENTE
        </button>
      </div>
    );
  }

  if (round >= CHALLENGES.length) return null;

  const isUrgent = timeLeft <= 15;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto h-full">
      <div className="text-center mb-8 flex flex-col items-center">
        <Trophy size={48} className="text-orange mb-4" />
        <p className="text-lg text-white/70 mb-2">O Grande Desafio Final!</p>
        <p className="text-xl font-medium text-orange bg-orange/10 px-6 py-2 rounded-full inline-block border border-orange/20">
          Responda todas as perguntas antes que o tempo acabe.
        </p>
      </div>

      <div className={clsx(
        "flex items-center justify-center gap-3 text-4xl font-fredoka font-bold mb-8 transition-colors duration-300",
        isUrgent ? "text-red-500 animate-pulse" : "text-yellow"
      )}>
        <Clock size={36} />
        00:{timeLeft.toString().padStart(2, '0')}
      </div>

      <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl mb-8 w-full">
        <div className="text-sm font-semibold text-cyan mb-2">
          Desafio {round + 1} de {CHALLENGES.length}
        </div>
        <div className="text-xl sm:text-2xl font-medium mb-6">
          {currentChallenge.question}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Sua resposta..."
            className="flex-1 bg-black/40 border-2 border-white/20 rounded-xl px-6 py-4 text-xl font-fredoka uppercase text-center focus:outline-none focus:border-cyan transition-colors"
            autoFocus
          />
          <button 
            onClick={handleCheck}
            className="btn-primary w-full sm:w-auto"
          >
            ENVIAR
          </button>
        </div>
      </div>
    </div>
  );
};
