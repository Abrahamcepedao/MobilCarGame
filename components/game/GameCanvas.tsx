'use client';

import { useRef, useEffect } from 'react';
import { GameState, Obstacle } from '@/types/game';

interface GameCanvasProps {
  gameState: GameState;
  carPosition: number;
  gameWidth: number;
  gameHeight: number;
  obstacles: Obstacle[];
  gameSpeed: number;
  checkCollisions: () => void;
  updateObstacles: (deltaTime: number) => void;
  addObstacle: () => void;
}

export default function GameCanvas({
  gameState,
  carPosition,
  gameWidth,
  gameHeight,
  obstacles,
  gameSpeed,
  checkCollisions,
  updateObstacles,
  addObstacle
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const carImage = useRef<HTMLImageElement | null>(null);
  const obstacleImage = useRef<HTMLImageElement | null>(null);
  const roadImage = useRef<HTMLImageElement | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const roadOffsetRef = useRef<number>(0);
  const obstacleTimerRef = useRef<number>(0);

  // Load assets
  useEffect(() => {
    // Car image - now using a sports car design
    const carImg = new Image();
    carImg.src = '/img/car.png';
    carImg.onload = () => {
      carImage.current = carImg;
    };

    // Obstacle image
    const obstacleImg = new Image();
    obstacleImg.src = '/img/barrier.png';
    obstacleImg.onload = () => {
      obstacleImage.current = obstacleImg;
    };

    // Road image with improved texture
    const roadImg = new Image();
    roadImg.src = '/img/road.png';
    roadImg.onload = () => {
      roadImage.current = roadImg;
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'running') return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    const gameLoop = (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }
      
      const deltaTime = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw road background (scrolling)
      if (roadImage.current) {
        roadOffsetRef.current += gameSpeed * deltaTime * 0.1;
        if (roadOffsetRef.current > canvas.height) {
          roadOffsetRef.current = 0;
        }
        
        ctx.drawImage(
          roadImage.current, 
          0, 
          roadOffsetRef.current - canvas.height, 
          canvas.width, 
          canvas.height * 2
        );
      } else {
        // Fallback road
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw white lines
        ctx.fillStyle = 'white';
        const lineWidth = 10;
        const lineGap = 40;
        const offsetY = (roadOffsetRef.current % (lineGap * 2)) - lineGap;
        
        for (let y = offsetY; y < canvas.height; y += lineGap * 2) {
          ctx.fillRect(canvas.width / 2 - lineWidth / 2, y, lineWidth, lineGap);
        }
      }
      
      // Add obstacles
      obstacleTimerRef.current += deltaTime;
      if (obstacleTimerRef.current > 1500 - gameSpeed * 100) {
        addObstacle();
        obstacleTimerRef.current = 0;
      }
      
      // Update and draw obstacles
      updateObstacles(deltaTime);
      obstacles.forEach(obstacle => {
        if (obstacleImage.current) {
          ctx.drawImage(
            obstacleImage.current,
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
          );
        } else {
          ctx.fillStyle = 'orange';
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
      });
      
      // Draw car with shadow and glow effect
      const carWidth = 70;
      const carHeight = 120;
      const carY = canvas.height - carHeight - 20;
      
      if (carImage.current) {
        // Draw shadow
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 5;
        
        ctx.drawImage(
          carImage.current,
          carPosition - carWidth / 2,
          carY,
          carWidth,
          carHeight
        );
        
        ctx.restore();
        
        // Draw speed lines when moving fast
        if (gameSpeed > 2) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 2;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(carPosition - carWidth / 2 + i * 20, carY + carHeight);
            ctx.lineTo(carPosition - carWidth / 2 + i * 20, carY + carHeight + 20);
            ctx.stroke();
          }
        }
      } else {
        // Fallback car
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(carPosition - carWidth / 2, carY, carWidth, carHeight);
      }
      
      // Check collisions
      checkCollisions();
      
      if (gameState === 'running') {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, carPosition, obstacles, gameSpeed, gameWidth, gameHeight, checkCollisions, updateObstacles, addObstacle]);

  return (
    <canvas
      ref={canvasRef}
      width={gameWidth}
      height={gameHeight}
      className="absolute top-0 left-0"
    />
  );
}