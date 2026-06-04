import { useReducer, useEffect } from 'react';
import type { GameState } from '../engine/types';
import { createInitialState, applyMove, undo } from '../engine';

type Action =
  | { type: 'MOVE'; boardIndex: number; cellIndex: number }
  | { type: 'UNDO' }
  | { type: 'NEW_GAME' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'MOVE':
      try {
        return applyMove(state, action.boardIndex, action.cellIndex);
      } catch {
        return state;
      }
    case 'UNDO':
      return undo(state);
    case 'NEW_GAME':
      return createInitialState();
  }
}

const STORAGE_KEY = 'xo-plus-v1';

function isValidState(v: unknown): v is GameState {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return (
    Array.isArray(s.bigBoard) && s.bigBoard.length === 9 &&
    Array.isArray(s.boardStatus) && s.boardStatus.length === 9 &&
    (s.currentPlayer === 'X' || s.currentPlayer === 'O') &&
    Array.isArray(s.moveHistory)
  );
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isValidState(parsed)) return parsed;
    }
  } catch {}
  return createInitialState();
}

export function useGameReducer() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  return {
    state,
    move: (boardIndex: number, cellIndex: number) =>
      dispatch({ type: 'MOVE', boardIndex, cellIndex }),
    undoMove: () => dispatch({ type: 'UNDO' }),
    newGame: () => dispatch({ type: 'NEW_GAME' }),
  };
}
