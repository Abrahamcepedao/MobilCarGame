'use client';

import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  restartGame: () => void;
}

export default function GameOverScreen({ 
  score, 
  highScore, 
  restartGame 
}: GameOverScreenProps) {
  const isNewHighScore = score > highScore;
  
  return (
    <motion.div 
      className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="bg-card rounded-xl p-8 max-w-xs w-full mx-auto shadow-lg text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
      >
        <h2 className="text-2xl font-bold mb-1 text-card-foreground">Game Over</h2>
        
        <div className="my-6">
          <div className="text-muted-foreground text-sm mb-1">Distance</div>
          <div className="text-4xl font-bold font-mono mb-4">{Math.floor(score)}m</div>
          
          {isNewHighScore && (
            <motion.div 
              className="text-primary font-bold text-lg mb-2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1.1 }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 0.6 
              }}
            >
              New High Score!
            </motion.div>
          )}
          
          <div className="text-muted-foreground text-sm">Best Distance</div>
          <div className="text-xl font-bold font-mono">{Math.floor(Math.max(score, highScore))}m</div>
        </div>
        
        <button
          onClick={restartGame}
          className="bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-lg w-full flex items-center justify-center gap-2 transition-colors font-medium"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
      </motion.div>
    </motion.div>
  );
}