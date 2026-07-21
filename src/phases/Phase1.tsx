import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/audio';
import clsx from 'clsx';

import { WORD_BANK } from '../data/wordBank';
import { pickRandom } from '../utils/random';
const WORDS = pickRandom(WORD_BANK.formapalavras, 5);

export const Phase1: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [round, setRound] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<{ letter: string; idx: number }[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  
  const currentWord = WORDS[round];

  useEffect(() => {
    if (currentWord) {
      // Shuffle letters
      const letters = currentWord.word.split('');
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      setShuffledLetters(letters);
      setSelectedLetters([]);
    }
  }, [round, currentWord]);

  const handleLetterClick = (letter: string, idx: number) => {
    if (selectedLetters.find(s => s.idx === idx)) return; // Already selected
    
    playSound.click();
    const newSelected = [...selectedLetters, { letter, idx }];
    setSelectedLetters(newSelected);

    // Check if word is complete
    if (newSelected.length === currentWord.word.length) {
      const formedWord = newSelected.map(s => s.letter).join('');
      if (formedWord === currentWord.word) {
        playSound.correct();
        setTimeout(() => {
          if (round + 1 >= WORDS.length) {
            onComplete();
          } else {
            setRound(r => r + 1);
          }
        }, 1000);
      } else {
        playSound.wrong();
        // Shake effect could be added here via state
        setTimeout(() => setSelectedLetters([]), 600);
      }
    }
  };

  const handleClear = () => {
    playSound.click();
    setSelectedLetters([]);
  };

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto h-full justify-center">
      <div className="text-center mb-8">
        <p className="text-lg text-white/70 mb-2">Clique nas letras na ordem certa para formar a palavra!</p>
        <div className="text-xl font-medium italic text-cyan bg-cyan/10 px-6 py-2 rounded-full inline-block border border-cyan/20">
          {currentWord.hint}
        </div>
      </div>

      {/* Slots */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 min-h-[60px]">
        {Array.from({ length: currentWord.word.length }).map((_, i) => {
          const selected = selectedLetters[i];
          return (
            <div 
              key={i}
              className={clsx(
                "w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center text-2xl font-fredoka font-bold rounded-xl transition-all duration-300",
                selected 
                  ? "bg-cyan/20 border-2 border-cyan text-cyan shadow-[0_0_15px_rgba(0,229,255,0.3)] scale-100" 
                  : "bg-white/5 border-2 border-dashed border-white/20 text-transparent scale-95"
              )}
            >
              {selected?.letter || ''}
            </div>
          );
        })}
      </div>

      {/* Letter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {shuffledLetters.map((letter, idx) => {
          const isUsed = selectedLetters.find(s => s.idx === idx);
          return (
            <button
              key={idx}
              onClick={() => handleLetterClick(letter, idx)}
              disabled={!!isUsed}
              className={clsx(
                "w-14 h-16 sm:w-16 sm:h-18 flex items-center justify-center text-3xl font-fredoka font-bold rounded-xl border-2 transition-all duration-200",
                isUsed 
                  ? "bg-white/5 border-white/10 text-white/20 scale-90 cursor-not-allowed" 
                  : "bg-white/10 border-white/20 text-white hover:bg-magenta/20 hover:border-magenta hover:text-magenta hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(224,64,251,0.4)] active:scale-95"
              )}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <button 
        onClick={handleClear}
        className="px-6 py-2 rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-semibold tracking-wider"
      >
        LIMPAR
      </button>

      {/* Progress Dots */}
      <div className="flex gap-2 mt-auto pt-8">
        {WORDS.map((_, i) => (
          <div 
            key={i} 
            className={clsx(
              "w-3 h-3 rounded-full transition-all duration-300",
              i < round ? "bg-green shadow-[0_0_10px_rgba(0,230,118,0.5)]" :
              i === round ? "bg-cyan scale-125 shadow-[0_0_10px_rgba(0,229,255,0.5)]" :
              "bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  );
};
