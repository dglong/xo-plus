import type { SmallBoard as SmallBoardType, BoardStatus, Player } from '../engine/types';
import { Cell } from './Cell';
import { XMark } from '../assets/XMark';
import { OMark } from '../assets/OMark';
import { getWinLine } from './helpers';
import { isLegalMove } from '../engine';
import type { GameState } from '../engine/types';
import './SmallBoard.scss';

interface SmallBoardProps {
  board: SmallBoardType;
  boardIndex: number;
  status: BoardStatus;
  isActive: boolean;
  isForcedActive: boolean;
  state: GameState;
  lastMoveCellIndex: number | null;
  pendingCellIndex: number | null;
  currentPlayer: Player;
  onCellClick: (cellIndex: number) => void;
}

export function SmallBoard({
  board,
  boardIndex,
  status,
  isActive,
  isForcedActive,
  state,
  lastMoveCellIndex,
  pendingCellIndex,
  currentPlayer,
  onCellClick,
}: SmallBoardProps) {
  const winLine = status !== 'OPEN' && status !== 'DRAW'
    ? getWinLine(board.cells)
    : null;

  const cls = [
    'small-board',
    isActive ? 'small-board--active' : '',
    isForcedActive ? 'small-board--forced' : '',
    status !== 'OPEN' ? `small-board--${status.toLowerCase().replace('won_', 'won-')}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cls}
      role="group"
      aria-label={`Board ${boardIndex + 1}${status !== 'OPEN' ? `, ${status === 'WON_X' ? 'won by X' : status === 'WON_O' ? 'won by O' : 'draw'}` : ''}`}
    >
      <div className="small-board__grid">
        {board.cells.map((value, cellIndex) => (
          <Cell
            key={cellIndex}
            value={value}
            isLegal={isLegalMove(state, boardIndex, cellIndex)}
            isPending={pendingCellIndex === cellIndex}
            isLastMove={lastMoveCellIndex === cellIndex}
            currentPlayer={currentPlayer}
            onClick={() => onCellClick(cellIndex)}
            boardIndex={boardIndex}
            cellIndex={cellIndex}
          />
        ))}
      </div>

      {winLine && (
        <svg
          className="small-board__win-line"
          viewBox="0 0 3 3"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            className="small-board__win-path"
            x1={(winLine[0] % 3) + 0.5}
            y1={Math.floor(winLine[0] / 3) + 0.5}
            x2={(winLine[2] % 3) + 0.5}
            y2={Math.floor(winLine[2] / 3) + 0.5}
            stroke="currentColor"
            strokeWidth="0.18"
            strokeLinecap="round"
            pathLength="1"
          />
        </svg>
      )}

      {status !== 'OPEN' && (
        <div className={`small-board__overlay small-board__overlay--${status === 'DRAW' ? 'draw' : status === 'WON_X' ? 'x' : 'o'}`}>
          {status === 'WON_X' && <XMark className="small-board__stamp" />}
          {status === 'WON_O' && <OMark className="small-board__stamp" />}
          {status === 'DRAW' && <span className="small-board__draw-label">draw</span>}
        </div>
      )}
    </div>
  );
}
