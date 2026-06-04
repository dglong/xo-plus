import type { CellState, Player } from '../engine/types';
import { XMark } from '../assets/XMark';
import { OMark } from '../assets/OMark';
import './Cell.scss';

interface CellProps {
  value: CellState;
  isLegal: boolean;
  isPending: boolean;
  isLastMove: boolean;
  currentPlayer: Player;
  onClick: () => void;
  boardIndex: number;
  cellIndex: number;
}

export function Cell({
  value,
  isLegal,
  isPending,
  isLastMove,
  currentPlayer,
  onClick,
  boardIndex,
  cellIndex,
}: CellProps) {
  const cls = [
    'cell',
    value === 'X' ? 'cell--x' : value === 'O' ? 'cell--o' : 'cell--empty',
    isLegal ? 'cell--legal' : '',
    isPending ? 'cell--pending' : '',
    isLastMove ? 'cell--last-move' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const ariaLabel = value
    ? `${value === 'X' ? 'Player X' : 'Player O'}`
    : isLegal
      ? `Empty cell, legal move`
      : `Empty cell`;

  return (
    <button
      className={cls}
      onClick={isLegal ? onClick : undefined}
      disabled={!isLegal}
      aria-label={ariaLabel}
      aria-pressed={isPending ? true : undefined}
      data-board={boardIndex}
      data-cell={cellIndex}
      tabIndex={isLegal ? 0 : -1}
    >
      {value === 'X' && <XMark />}
      {value === 'O' && <OMark />}
      {value === null && isPending && (
        <div className="cell__pending-mark" aria-hidden="true">
          {currentPlayer === 'X' ? <XMark /> : <OMark />}
        </div>
      )}
      {value === null && !isPending && isLegal && (
        <div className="cell__ghost" aria-hidden="true">
          {currentPlayer === 'X' ? <XMark /> : <OMark />}
        </div>
      )}
      {isLastMove && <span className="cell__last-dot" aria-hidden="true" />}
    </button>
  );
}
