import React from 'react';
import { Background3D } from './components/Background3D';
import { useGameStore } from './store/useGameStore';
import { StartScreen } from './screens/StartScreen';
import { LevelMap } from './screens/LevelMap';
import { PhaseContainer } from './screens/PhaseContainer';
import { AnimatePresence } from 'framer-motion';

function App() {
  const currentPhase = useGameStore((state) => state.currentPhase);

  return (
    <>
      <Background3D />
      
      <main className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden z-10">
        <AnimatePresence mode="wait">
          {currentPhase === 0 && <StartScreen key="start" />}
          {currentPhase === -1 && <LevelMap key="map" />}
          {currentPhase > 0 && <PhaseContainer key="phase" />}
        </AnimatePresence>
      </main>
    </>
  );
}

export default App;
