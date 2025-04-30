'use client';

import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { GameState } from '@/types/game';

interface ControlsProps {
  carPosition: number;
  setCarPosition: (position: number) => void;
  gameWidth: number;
  gameState: GameState;
  startGame: () => void;
}

export default function Controls({
  carPosition,
  setCarPosition,
  gameWidth,
  gameState,
  startGame
}: ControlsProps) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const moveStep = gameWidth * 0.02; // 2% of game width

  // Handle swipe controls
  useEffect(() => {
    if (gameState !== 'running') return;

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX === null) return;
      
      const touchX = e.touches[0].clientX;
      const diffX = touchX - touchStartX;
      
      if (Math.abs(diffX) > 10) { // Small threshold to avoid accidental moves
        let newPosition = carPosition + diffX;
        
        // Constrain to game bounds
        newPosition = Math.max(gameWidth * 0.15, Math.min(newPosition, gameWidth * 0.85));
        
        setCarPosition(newPosition);
        setTouchStartX(touchX);
      }
    };

    const handleTouchEnd = () => {
      setTouchStartX(null);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState, carPosition, setCarPosition, touchStartX, gameWidth]);

  // Handle keyboard controls
  useEffect(() => {
    if (gameState !== 'running') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        let newPosition = carPosition - moveStep;
        newPosition = Math.max(gameWidth * 0.15, newPosition);
        setCarPosition(newPosition);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        let newPosition = carPosition + moveStep;
        newPosition = Math.min(newPosition, gameWidth * 0.85);
        setCarPosition(newPosition);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, carPosition, setCarPosition, moveStep, gameWidth]);

  if (gameState === 'ready') {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <button
          onClick={startGame}
          className="bg-primary rounded-full p-8 shadow-lg hover:bg-primary/80 transition-colors"
          aria-label="Start Game"
        >
          <Play className="w-12 h-12 text-primary-foreground" />
        </button>
      </div>
    );
  }

  return null;
}