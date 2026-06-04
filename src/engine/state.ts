import type { CellState, Player, BoardStatus, GameResult, SmallBoard, GameState } from './types';
import { WIN_LINES } from './constants';

function emptySmallBoard(): SmallBoard {
  return { cells: Array(9).fill(null) as CellState[] };
}

export function createInitialState(): GameState {
  return {
    bigBoard: Array.from({ length: 9 }, emptySmallBoard),
    boardStatus: Array(9).fill('OPEN') as BoardStatus[],
    currentPlayer: 'X',
    activeBoard: null,
    winner: null,
    moveHistory: [],
  };
}

export function lineWinner(cells: readonly CellState[]): Player | null {
  for (const [a, b, c] of WIN_LINES) {
    if (cells[a] !== null && cells[a] === cells[b] && cells[b] === cells[c]) {
      return cells[a] as Player;
    }
  }
  return null;
}

export function computeBoardStatus(board: SmallBoard): BoardStatus {
  const w = lineWinner(board.cells);
  if (w === 'X') return 'WON_X';
  if (w === 'O') return 'WON_O';
  if (board.cells.every(c => c !== null)) return 'DRAW';
  return 'OPEN';
}

export function resolveGame(boardStatuses: readonly BoardStatus[]): GameResult {
  const bigCells: CellState[] = boardStatuses.map(s =>
    s === 'WON_X' ? 'X' : s === 'WON_O' ? 'O' : null
  );
  const w = lineWinner(bigCells);
  if (w) return w;
  if (boardStatuses.every(s => s !== 'OPEN')) return 'DRAW';
  return null;
}
