import React, { useState } from 'react';
import { playSound } from '../utils/audio';
import clsx from 'clsx';

import { WORD_BANK } from '../data/wordBank';
import { pickRandom } from '../utils/random';
const selected = pickRandom(WORD_BANK.desembaralhe, 4);
const WORDS = selected.map(w => ({ scrambled: w.correct.split('').sort(() => Math.random() - 0.5).join(' '), correct: w.correct }));

export const Phase3: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [round, setRound] = useState(0);
  const [input, setInput] = useState('');
  
  const current = WORDS[round];

  const handleCheck = () => {
    if (input.toUpperCase() === current.correct) {
      playSound.correct();
      setTimeout(() => {
        if (round + 1 >= WORDS.length) {
          onComplete();
        } else {
          setRound(r => r + 1);
          setInput('');
        }
      }, 800);
    } else {
      playSound.wrong();
      setInput('');
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto h-full">
      <div className="text-center mb-8">
        <p className="text-lg text-white/70">Desembaralhe as letras para formar a palavra correta.</p>
      </div>

      <div className="text-5xl font-fredoka font-bold text-yellow mb-12 tracking-widest bg-white/5 px-8 py-4 rounded-2xl border border-white/10">
        {current.scrambled}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        placeholder="Digite aqui..."
        className="w-full bg-black/40 border-2 border-white/20 rounded-xl px-6 py-4 text-2xl font-fredoka uppercase text-center focus:outline-none focus:border-cyan transition-colors mb-6"
        autoFocus
      />
      
      <button onClick={handleCheck} className="btn-primary w-full">
        VERIFICAR
      </button>

      <div className="flex gap-2 mt-auto pt-8">
        {WORDS.map((_, i) => (
          <div key={i} className={clsx("w-3 h-3 rounded-full transition-colors", i <= round ? "bg-cyan" : "bg-white/20")} />
        ))}
      </div>
    </div>
  );
};
