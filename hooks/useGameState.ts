'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Obstacle } from '@/types/game';

// Get random number between min and max
const getRandomPosition = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [carPosition, setCarPosition] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const gameWidth = useRef(0);
  const gameHeight = useRef(0);

  // Initialize game dimensions and car position
  useEffect(() => {
    const width = Math.min(window.innerWidth * 0.95, 500);
    const height = Math.min(window.innerHeight * 0.8, 800);
    
    gameWidth.current = width;
    gameHeight.current = height;
    
    // Position car in the middle lane
    setCarPosition(width / 2);
    
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('carGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Game actions
  const startGame = useCallback(() => {
    setGameState('running');
    setScore(0);
    setGameSpeed(1);
    setObstacles([]);
  }, []);

  const endGame = useCallback(() => {
    setGameState('gameover');
    
    // Update high score if needed
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('carGameHighScore', score.toString());
    }
  }, [score, highScore]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // Add new obstacle
  const addObstacle = useCallback(() => {
    const obstacleWidth = gameWidth.current * 0.1; // 10% of game width
    const obstacleHeight = gameHeight.current * 0.075; // 7.5% of game height
    
    // Determine random x position (3 lanes)
    const laneWidth = gameWidth.current / 3;
    const lane = Math.floor(Math.random() * 3); // 0, 1, or 2
    const x = (lane * laneWidth) + (laneWidth - obstacleWidth) / 2;
    
    const newObstacle: Obstacle = {
      x,
      y: -obstacleHeight, // Start above the screen
      width: obstacleWidth,
      height: obstacleHeight,
      speed: gameSpeed,
    };
    
    setObstacles(prev => [...prev, newObstacle]);
  }, [gameSpeed]);

  // Update obstacles positions
  const updateObstacles = useCallback((deltaTime: number) => {
    setObstacles(prev => {
      return prev
        .map(obstacle => ({
          ...obstacle,
          y: obstacle.y + obstacle.speed * deltaTime * 0.15, // Move down
        }))
        .filter(obstacle => obstacle.y < gameHeight.current); // Remove obstacles that are off-screen
    });
  }, []);

  // Check collisions
  const checkCollisions = useCallback(() => {
    if (gameState !== 'running') return;
    
    const carWidth = gameWidth.current * 0.12; // 12% of game width
    const carHeight = gameHeight.current * 0.125; // 12.5% of game height
    const carY = gameHeight.current - carHeight - 20; // Position from bottom
    
    const carHitbox = {
      x: carPosition - carWidth / 2,
      y: carY,
      width: carWidth,
      height: carHeight,
    };
    
    // Check if car collides with any obstacle
    const collision = obstacles.some(obstacle => {
      // Add a smaller hitbox for better gameplay (70% of actual size)
      const shrinkFactor = 0.7;
      const shrinkX = obstacle.width * (1 - shrinkFactor) / 2;
      const shrinkY = obstacle.height * (1 - shrinkFactor) / 2;
      
      const obstacleHitbox = {
        x: obstacle.x + shrinkX,
        y: obstacle.y + shrinkY,
        width: obstacle.width * shrinkFactor,
        height: obstacle.height * shrinkFactor,
      };
      
      return (
        carHitbox.x < obstacleHitbox.x + obstacleHitbox.width &&
        carHitbox.x + carHitbox.width > obstacleHitbox.x &&
        carHitbox.y < obstacleHitbox.y + obstacleHitbox.height &&
        carHitbox.y + carHitbox.height > obstacleHitbox.y
      );
    });
    
    if (collision) {
      endGame();
    }
  }, [carPosition, obstacles, gameState, endGame]);

  // Update score and increase game speed over time
  useEffect(() => {
    if (gameState !== 'running') return;
    
    const scoreInterval = setInterval(() => {
      setScore(prev => {
        const newScore = prev + gameSpeed * 0.1;
        
        // Increase game speed as score increases
        if (Math.floor(newScore) % 100 === 0 && newScore > 0) {
          setGameSpeed(prev => Math.min(prev + 0.2, 5)); // Cap at 5x speed
        }
        
        return newScore;
      });
    }, 100);
    
    return () => {
      clearInterval(scoreInterval);
    };
  }, [gameState, gameSpeed]);

  return {
    gameState,
    score,
    highScore,
    carPosition,
    setCarPosition,
    gameSpeed,
    obstacles,
    startGame,
    endGame,
    restartGame,
    addObstacle,
    updateObstacles,
    checkCollisions,
  };
}