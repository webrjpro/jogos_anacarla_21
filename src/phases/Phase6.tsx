import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/audio';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { GripVertical } from 'lucide-react';

const CORRECT_ORDER = [
  { id: '1', text: 'Era uma vez uma menina chamada Luna que adorava ler livros.' },
  { id: '2', text: 'Um dia, ela encontrou um misterioso livro velho na biblioteca.' },
  { id: '3', text: 'Ao abrir a capa dourada, as palavras começaram a flutuar no ar.' },
  { id: '4', text: 'Luna foi puxada para dentro das páginas brilhantes.' },
  { id: '5', text: 'E assim, ela viveu a maior aventura de toda a sua vida.' },
];

const SortableItem = ({ id, text, index }: { id: string, text: string, index: number }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "flex items-center gap-4 p-4 mb-3 rounded-xl border transition-colors",
        isDragging 
          ? "bg-panel border-cyan shadow-[0_0_20px_rgba(0,229,255,0.4)] opacity-90 scale-105 z-50" 
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
      )}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 text-white/40 hover:text-cyan transition-colors"
      >
        <GripVertical size={20} />
      </div>
      <div className="flex-1 text-sm sm:text-base leading-relaxed text-white/90">
        <span className="font-fredoka font-bold text-cyan mr-3">{index + 1}.</span>
        {text}
      </div>
    </div>
  );
};

export const Phase6: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [items, setItems] = useState(() => {
    // Shuffle on mount
    const shuffled = [...CORRECT_ORDER];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Ensure it's not already correct by chance
    if (shuffled.every((item, i) => item.id === CORRECT_ORDER[i].id)) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    return shuffled;
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      playSound.click();
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCheck = () => {
    const isCorrect = items.every((item, index) => item.id === CORRECT_ORDER[index].id);
    if (isCorrect) {
      playSound.correct();
      setTimeout(onComplete, 800);
    } else {
      playSound.wrong();
      // We could add visual feedback here
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto h-full">
      <div className="text-center mb-8">
        <p className="text-lg text-white/70 mb-2">A história ficou toda bagunçada!</p>
        <p className="text-xl font-medium text-cyan bg-cyan/10 px-6 py-2 rounded-full inline-block border border-cyan/20">
          Arraste as frases para a ordem correta para reconstruir o texto.
        </p>
      </div>

      <div className="w-full bg-black/20 p-4 sm:p-6 rounded-2xl border border-white/5 shadow-inner mb-8">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item, index) => (
              <SortableItem key={item.id} id={item.id} text={item.text} index={index} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <button 
        onClick={handleCheck}
        className="btn-primary w-full max-w-xs mb-8"
      >
        VERIFICAR ORDEM
      </button>
    </div>
  );
};
