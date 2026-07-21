import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/audio';
import clsx from 'clsx';

import { WORD_BANK } from '../data/wordBank';
import { pickRandom } from '../utils/random';
const PAIRS = pickRandom(WORD_BANK.sinonimos, 4).map((p, i) => ({ id: i + 1, ...p }));

export const Phase2: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [cards, setCards] = useState<{ id: string; text: string; pairId: number; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const initialCards = PAIRS.flatMap(p => [
      { id: `a-${p.id}`, text: p.word1, pairId: p.id, isFlipped: false, isMatched: false },
      { id: `b-${p.id}`, text: p.word2, pairId: p.id, isFlipped: false, isMatched: false }
    ]).sort(() => Math.random() - 0.5);
    setCards(initialCards);
  }, []);

  const handleCardClick = (id: string) => {
    if (disabled) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    playSound.click();
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));
    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const card1 = cards.find(c => c.id === newFlipped[0])!;
      const card2 = cards.find(c => c.id === newFlipped[1] || c.id === id)!;

      if (card1.pairId === card2.pairId) {
        playSound.correct();
        setCards(prev => {
          const newCards = prev.map(c => 
            c.id === card1.id || c.id === card2.id ? { ...c, isMatched: true } : c
          );
          if (newCards.filter(c => c.isMatched).length === newCards.length) {
            setTimeout(onComplete, 1000);
          }
          return newCards;
        });
        setFlippedIds([]);
        setDisabled(false);
      } else {
        playSound.wrong();
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c
          ));
          setFlippedIds([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto h-full">
      <div className="text-center mb-8">
        <p className="text-lg text-white/70">Jogo da Memória dos Sinônimos</p>
        <p className="text-sm text-cyan mt-2">Encontre os pares de palavras que significam a mesma coisa!</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={clsx(
              "relative h-24 sm:h-32 rounded-xl text-lg sm:text-xl font-bold transition-all duration-500 [transform-style:preserve-3d]",
              card.isFlipped || card.isMatched ? "[transform:rotateY(180deg)]" : "",
              card.isMatched ? "opacity-50" : ""
            )}
            style={{ perspective: '1000px' }}
          >
            <div className={clsx(
              "absolute inset-0 w-full h-full backface-hidden rounded-xl border-2 flex items-center justify-center bg-white/5 border-white/20 hover:bg-white/10 transition-colors",
              card.isFlipped || card.isMatched ? "hidden" : "block"
            )}>
              <span className="text-4xl">🧠</span>
            </div>
            
            <div className={clsx(
              "absolute inset-0 w-full h-full rounded-xl border-2 flex items-center justify-center [transform:rotateY(180deg)]",
              card.isMatched ? "bg-green/20 border-green text-green" : "bg-cyan/20 border-cyan text-cyan"
            )}>
              {card.text}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
