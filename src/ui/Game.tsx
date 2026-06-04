import { useState, useRef, useEffect } from 'react';
import { useGameReducer } from '../hooks/useGameReducer';
import { isLegalMove } from '../engine';
import { BigBoard } from './BigBoard';
import { HUD } from './HUD';
import { GameBanner } from './GameBanner';
import { Settings, loadSettings, type GameSettings } from './Settings';
import './Game.scss';

export function Game() {
  const { state, move, undoMove, newGame } = useGameReducer();
  const [pendingMove, setPendingMove] = useState<{ boardIndex: number; cellIndex: number } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const isTouchDevice = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches,
  );

  // Clear pending if it becomes illegal (e.g. after undo or active board changes)
  useEffect(() => {
    if (
      pendingMove &&
      !isLegalMove(state, pendingMove.boardIndex, pendingMove.cellIndex)
    ) {
      setPendingMove(null);
    }
  }, [state, pendingMove]);

  function handleCellClick(boardIndex: number, cellIndex: number) {
    if (!isLegalMove(state, boardIndex, cellIndex)) return;

    if (isTouchDevice.current && settings.confirmTap) {
      if (
        pendingMove?.boardIndex === boardIndex &&
        pendingMove?.cellIndex === cellIndex
      ) {
        move(boardIndex, cellIndex);
        setPendingMove(null);
      } else {
        setPendingMove({ boardIndex, cellIndex });
      }
    } else {
      move(boardIndex, cellIndex);
    }
  }

  function handleUndo() {
    setPendingMove(null);
    undoMove();
  }

  function handleNewGame() {
    setPendingMove(null);
    newGame();
  }

  const canUndo = state.moveHistory.length > 0 && state.winner === null;

  return (
    <main className="game">
      <HUD
        state={state}
        canUndo={canUndo}
        onUndo={handleUndo}
        onNewGame={handleNewGame}
        onSettings={() => setShowSettings(true)}
        pendingConfirm={pendingMove !== null}
      />

      <div className="game__board-area">
        <BigBoard
          state={state}
          currentPlayer={state.currentPlayer}
          pendingMove={pendingMove}
          onCellClick={handleCellClick}
        />
      </div>

      {state.winner && (
        <GameBanner winner={state.winner} onNewGame={handleNewGame} />
      )}

      {showSettings && (
        <Settings
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </main>
  );
}
