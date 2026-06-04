import type { GameState } from '../engine/types';
import { XMark } from '../assets/XMark';
import { OMark } from '../assets/OMark';
import './HUD.scss';

interface HUDProps {
  state: GameState;
  canUndo: boolean;
  onUndo: () => void;
  onNewGame: () => void;
  onSettings: () => void;
  pendingConfirm: boolean;
}

export function HUD({ state, canUndo, onUndo, onNewGame, onSettings, pendingConfirm }: HUDProps) {
  const { currentPlayer, boardStatus, activeBoard, winner } = state;

  const xScore = boardStatus.filter(s => s === 'WON_X').length;
  const oScore = boardStatus.filter(s => s === 'WON_O').length;

  const hintText = winner
    ? ''
    : activeBoard !== null
      ? `Play in board ${activeBoard + 1}`
      : 'Free move — any board';

  const confirmHint = pendingConfirm ? 'Tap again to confirm' : '';

  return (
    <header className="hud">
      <div className="hud__title-row">
        <h1 className="hud__title">xo+</h1>

        <div className="hud__controls">
          <button
            className="hud__btn hud__btn--undo"
            onClick={onUndo}
            disabled={!canUndo}
            aria-label="Undo last move"
            title="Undo"
          >
            ↩
          </button>
          <button
            className="hud__btn hud__btn--new"
            onClick={onNewGame}
            aria-label="New game"
            title="New game"
          >
            ↺
          </button>
          <button
            className="hud__btn hud__btn--settings"
            onClick={onSettings}
            aria-label="Settings"
            title="Settings"
          >
            ⚙
          </button>
        </div>
      </div>

      {!winner && (
        <div className="hud__status">
          <div className={`hud__player hud__player--${currentPlayer.toLowerCase()}`}>
            <span className="hud__player-mark">
              {currentPlayer === 'X' ? <XMark size={20} /> : <OMark size={20} />}
            </span>
            <span className="hud__player-label">
              {currentPlayer}&rsquo;s turn
            </span>
          </div>

          <div className="hud__score">
            <span className="hud__score-x" aria-label={`X has ${xScore} boards`}>
              {Array.from({ length: 9 }, (_, i) => (
                <span
                  key={i}
                  className={`hud__pip hud__pip--x${i < xScore ? ' hud__pip--filled' : ''}`}
                  aria-hidden="true"
                />
              ))}
            </span>
            <span className="hud__score-sep">·</span>
            <span className="hud__score-o" aria-label={`O has ${oScore} boards`}>
              {Array.from({ length: 9 }, (_, i) => (
                <span
                  key={i}
                  className={`hud__pip hud__pip--o${i < oScore ? ' hud__pip--filled' : ''}`}
                  aria-hidden="true"
                />
              ))}
            </span>
          </div>
        </div>
      )}

      {(hintText || confirmHint) && (
        <div className="hud__hint" aria-live="polite" aria-atomic="true">
          {confirmHint || hintText}
        </div>
      )}
    </header>
  );
}
