export type Player = 'X' | 'O';
export type CellState = Player | null;
export type BoardStatus = 'OPEN' | 'WON_X' | 'WON_O' | 'DRAW';
export type GameResult = Player | 'DRAW' | null;

export interface SmallBoard {
  readonly cells: readonly CellState[];
}

export interface Move {
  readonly player: Player;
  readonly boardIndex: number;
  readonly cellIndex: number;
}

export interface GameState {
  readonly bigBoard: readonly SmallBoard[];
  readonly boardStatus: readonly BoardStatus[];
  readonly currentPlayer: Player;
  readonly activeBoard: number | null;
  readonly winner: GameResult;
  readonly moveHistory: readonly Move[];
}
