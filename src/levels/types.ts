export interface Context {
  gameOver: () => void;
}

export type Ring = {
  data: {
    active: boolean;
    width: number,
    color?: string
  }[]
  color?: string
}

export type State = {
  rotation: number
  offset: number | null
  rings: Ring[]
  ring: number
  score: number
  speed: number
  t: number
}
