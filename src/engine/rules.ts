import type { GameState, Move, Player } from './types';
import { computeBoardStatus, createInitialState, resolveGame } from './state';

export function isLegalMove(state: GameState, boardIndex: number, cellIndex: number): boolean {
  if (state.winner !== null) return false;
  if (state.boardStatus[boardIndex] !== 'OPEN') return false;
  if (state.bigBoard[boardIndex].cells[cellIndex] !== null) return false;
  if (state.activeBoard !== null && boardIndex !== state.activeBoard) return false;
  return true;
}

export function getLegalMoves(state: GameState): Move[] {
  if (state.winner !== null) return [];
  const moves: Move[] = [];
  for (let b = 0; b < 9; b++) {
    for (let c = 0; c < 9; c++) {
      if (isLegalMove(state, b, c)) {
        moves.push({ player: state.currentPlayer, boardIndex: b, cellIndex: c });
      }
    }
  }
  return moves;
}

export function applyMove(state: GameState, boardIndex: number, cellIndex: number): GameState {
  if (!isLegalMove(state, boardIndex, cellIndex)) {
    throw new Error(`Illegal move: board ${boardIndex}, cell ${cellIndex}`);
  }

  const move: Move = { player: state.currentPlayer, boardIndex, cellIndex };

  const newCells = [...state.bigBoard[boardIndex].cells] as (typeof state.bigBoard[0]['cells'][0])[];
  newCells[cellIndex] = state.currentPlayer;
  const newSmallBoard = { cells: newCells };

  const newBigBoard = [...state.bigBoard];
  newBigBoard[boardIndex] = newSmallBoard;

  const newBoardStatus = [...state.boardStatus];
  newBoardStatus[boardIndex] = computeBoardStatus(newSmallBoard);

  const nextActiveBoard = newBoardStatus[cellIndex] === 'OPEN' ? cellIndex : null;

  const newWinner = resolveGame(newBoardStatus);
  const nextPlayer: Player = state.currentPlayer === 'X' ? 'O' : 'X';

  return {
    bigBoard: newBigBoard,
    boardStatus: newBoardStatus,
    currentPlayer: newWinner !== null ? state.currentPlayer : nextPlayer,
    activeBoard: newWinner !== null ? null : nextActiveBoard,
    winner: newWinner,
    moveHistory: [...state.moveHistory, move],
  };
}

export function undo(state: GameState): GameState {
  if (state.moveHistory.length === 0) return state;
  const previousMoves = state.moveHistory.slice(0, -1);
  let s = createInitialState();
  for (const { boardIndex, cellIndex } of previousMoves) {
    s = applyMove(s, boardIndex, cellIndex);
  }
  return s;
}
