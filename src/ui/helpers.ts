import type { CellState, BoardStatus } from '../engine/types';
import { WIN_LINES } from '../engine';

export function getWinLine(cells: readonly CellState[]): readonly [number, number, number] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (cells[a] !== null && cells[a] === cells[b] && cells[b] === cells[c]) {
      return line;
    }
  }
  return null;
}

export function getBigBoardWinLine(
  boardStatus: readonly BoardStatus[],
): readonly [number, number, number] | null {
  const bigCells: CellState[] = boardStatus.map(s =>
    s === 'WON_X' ? 'X' : s === 'WON_O' ? 'O' : null,
  );
  return getWinLine(bigCells);
}
