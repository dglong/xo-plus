import { useCallback, useRef } from 'react';
import type { GameState, Player } from '../engine/types';
import { SmallBoard } from './SmallBoard';
import { getBigBoardWinLine } from './helpers';
import './BigBoard.scss';

interface BigBoardProps {
  state: GameState;
  currentPlayer: Player;
  pendingMove: { boardIndex: number; cellIndex: number } | null;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
}

export function BigBoard({ state, currentPlayer, pendingMove, onCellClick }: BigBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  const lastMove = state.moveHistory.length > 0
    ? state.moveHistory[state.moveHistory.length - 1]
    : null;

  const winLine = state.winner ? getBigBoardWinLine(state.boardStatus) : null;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();

    const focused = document.activeElement as HTMLElement;
    const boardAttr = focused.getAttribute('data-board');
    const cellAttr = focused.getAttribute('data-cell');
    if (boardAttr === null || cellAttr === null) return;

    const boardIndex = parseInt(boardAttr, 10);
    const cellIndex = parseInt(cellAttr, 10);

    const boardRow = Math.floor(boardIndex / 3);
    const boardCol = boardIndex % 3;
    const cellRow = Math.floor(cellIndex / 3);
    const cellCol = cellIndex % 3;

    let fullRow = boardRow * 3 + cellRow;
    let fullCol = boardCol * 3 + cellCol;

    if (e.key === 'ArrowUp')    fullRow = Math.max(0, fullRow - 1);
    if (e.key === 'ArrowDown')  fullRow = Math.min(8, fullRow + 1);
    if (e.key === 'ArrowLeft')  fullCol = Math.max(0, fullCol - 1);
    if (e.key === 'ArrowRight') fullCol = Math.min(8, fullCol + 1);

    const newBoardIndex = Math.floor(fullRow / 3) * 3 + Math.floor(fullCol / 3);
    const newCellIndex  = (fullRow % 3) * 3 + (fullCol % 3);

    const target = boardRef.current?.querySelector<HTMLElement>(
      `[data-board="${newBoardIndex}"][data-cell="${newCellIndex}"]`,
    );
    target?.focus();
  }, []);

  return (
    <div
      className={[
        'big-board',
        state.winner === 'X' ? 'big-board--winner-x' : '',
        state.winner === 'O' ? 'big-board--winner-o' : '',
      ].filter(Boolean).join(' ')}
      role="grid"
      aria-label="Ultimate tic-tac-toe board"
      onKeyDown={handleKeyDown}
      ref={boardRef}
    >
      {state.bigBoard.map((board, boardIndex) => {
        const status = state.boardStatus[boardIndex];
        const isActive =
          state.winner === null &&
          status === 'OPEN' &&
          (state.activeBoard === null || state.activeBoard === boardIndex);
        const isForcedActive = isActive && state.activeBoard === boardIndex;

        return (
          <SmallBoard
            key={boardIndex}
            board={board}
            boardIndex={boardIndex}
            status={status}
            isActive={isActive}
            isForcedActive={isForcedActive}
            state={state}
            lastMoveCellIndex={
              lastMove?.boardIndex === boardIndex ? lastMove.cellIndex : null
            }
            pendingCellIndex={
              pendingMove?.boardIndex === boardIndex ? pendingMove.cellIndex : null
            }
            currentPlayer={currentPlayer}
            onCellClick={(cellIndex) => onCellClick(boardIndex, cellIndex)}
          />
        );
      })}

      {winLine && (
        <svg
          className="big-board__win-line"
          viewBox="0 0 3 3"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            className="big-board__win-path"
            x1={(winLine[0] % 3) + 0.5}
            y1={Math.floor(winLine[0] / 3) + 0.5}
            x2={(winLine[2] % 3) + 0.5}
            y2={Math.floor(winLine[2] / 3) + 0.5}
            stroke="currentColor"
            strokeWidth="0.1"
            strokeLinecap="round"
            pathLength="1"
          />
        </svg>
      )}
    </div>
  );
}
