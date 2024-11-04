export interface Context {
  gameOver: () => void;
}

export interface RingPad {
  active: boolean;
  width: number;
  color?: string;
}

export interface Ring {
  data: RingPad[]
  color?: string
}

export interface LevelState {
  rotation: number
  offset: number | null
  rings: Ring[]
  score: number
  currentLevel: number
  speed: number
  t: number
}

export interface GameState {
  level: LevelState;
  gameOver: boolean;
  paused: boolean;
}

export interface GameModeType {
  reset: (ctx: Context, state: LevelState) => LevelState;
  rotate: (r: number) => { rotation: number };
  step: (ctx: Context, state: LevelState, kill?: boolean) => LevelState;
}
