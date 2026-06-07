import type { GameResult } from '../engine/types';
import { XMark } from '../assets/XMark';
import { OMark } from '../assets/OMark';
import './GameBanner.scss';

interface GameBannerProps {
  winner: GameResult;
  onNewGame: () => void;
}

export function GameBanner({ winner, onNewGame }: GameBannerProps) {
  if (!winner) return null;

  const isDraw = winner === 'DRAW';

  return (
    <div className="banner-backdrop" role="dialog" aria-modal="true" aria-label="Game over">
      <div className="banner">
        {!isDraw && (
          <div className={`banner__mark banner__mark--${winner.toLowerCase()}`}>
            {winner === 'X' ? <XMark /> : <OMark />}
          </div>
        )}

        <div className="banner__text">
          {isDraw ? (
            <>
              <span className="banner__headline">Draw!</span>
              <span className="banner__sub">No one wins this time</span>
            </>
          ) : (
            <>
              <span className="banner__headline">{winner} wins!</span>
              <span className="banner__sub">Well played</span>
            </>
          )}
        </div>

        <button className="banner__btn" onClick={onNewGame} autoFocus>
          Play again
        </button>
      </div>
    </div>
  );
}
