export type GameState = 'ready' | 'running' | 'gameover';

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}