'use client';

import { useState, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import Controls from './Controls';
import ScoreBoard from './ScoreBoard';
import GameOverScreen from './GameOverScreen';
import { useGameState } from '@/hooks/useGameState';
import { cn } from '@/lib/utils';

export default function Game() {
  const { 
    gameState, 
    score, 
    highScore,
    startGame, 
    endGame, 
    restartGame,
    carPosition,
    setCarPosition,
    gameSpeed,
    obstacles,
    addObstacle,
    updateObstacles,
    checkCollisions
  } = useGameState();

  const [windowSize, setWindowSize] = useState({ 
    width: 0, 
    height: 0 
  });

  useEffect(() => {
    // Set window size
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determine game dimensions based on screen size
  const gameWidth = Math.min(windowSize.width * 0.95, 500);
  const gameHeight = Math.min(windowSize.height * 0.8, 800);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <div 
        className={cn(
          "relative bg-slate-800 rounded-lg shadow-lg overflow-hidden",
          "border-2 border-slate-700"
        )}
        style={{ 
          width: `${gameWidth}px`, 
          height: `${gameHeight}px`,
          maxWidth: '100%',
          maxHeight: '80vh'
        }}
      >
        <GameCanvas 
          gameState={gameState}
          carPosition={carPosition}
          gameWidth={gameWidth}
          gameHeight={gameHeight}
          obstacles={obstacles}
          gameSpeed={gameSpeed}
          checkCollisions={checkCollisions}
          updateObstacles={updateObstacles}
          addObstacle={addObstacle}
        />
        
        <ScoreBoard 
          score={score} 
          highScore={highScore} 
          gameState={gameState} 
        />
        
        <Controls 
          carPosition={carPosition}
          setCarPosition={setCarPosition}
          gameWidth={gameWidth}
          gameState={gameState}
          startGame={startGame}
        />
        
        {gameState === 'gameover' && (
          <GameOverScreen 
            score={score} 
            highScore={highScore} 
            restartGame={restartGame} 
          />
        )}
      </div>
    </div>
  );
}