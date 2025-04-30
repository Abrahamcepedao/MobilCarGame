'use client';

import { GameState } from '@/types/game';
import { cn } from '@/lib/utils';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  gameState: GameState;
}

export default function ScoreBoard({ score, highScore, gameState }: ScoreBoardProps) {
  return (
    <div className={cn(
      "absolute top-0 left-0 right-0 p-4 flex justify-between items-center",
      "bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm",
      "text-white z-10"
    )}>
      <div className="text-lg font-semibold">
        <div className="text-xs uppercase tracking-wider text-white/70">Score</div>
        <div className="font-mono">{Math.floor(score)}m</div>
      </div>
      
      <div className="text-lg font-semibold text-right">
        <div className="text-xs uppercase tracking-wider text-white/70">Best</div>
        <div className="font-mono">{Math.floor(highScore)}m</div>
      </div>
    </div>
  );
}