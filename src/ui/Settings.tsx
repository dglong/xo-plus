import './Settings.scss';

export interface GameSettings {
  confirmTap: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  confirmTap: true,
};

const SETTINGS_KEY = 'xo-plus-settings';

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GameSettings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {}
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(s: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {}
}

interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (s: GameSettings) => void;
  onClose: () => void;
}

export function Settings({ settings, onSettingsChange, onClose }: SettingsProps) {
  function toggle(key: keyof GameSettings) {
    const next = { ...settings, [key]: !settings[key] };
    onSettingsChange(next);
    saveSettings(next);
  }

  return (
    <div className="settings-backdrop" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="settings-panel">
        <div className="settings-panel__header">
          <h2 className="settings-panel__title">Settings</h2>
          <button className="settings-panel__close" onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>

        <section className="settings-panel__section">
          <h3 className="settings-panel__section-title">Controls</h3>
          <label className="settings-toggle">
            <div className="settings-toggle__info">
              <span className="settings-toggle__label">Confirm move on tap</span>
              <span className="settings-toggle__desc">
                Tap once to preview, tap again to confirm. Recommended on touchscreens.
              </span>
            </div>
            <button
              role="switch"
              aria-checked={settings.confirmTap}
              className={`settings-toggle__switch${settings.confirmTap ? ' settings-toggle__switch--on' : ''}`}
              onClick={() => toggle('confirmTap')}
            >
              <span className="settings-toggle__knob" />
            </button>
          </label>
        </section>

        <section className="settings-panel__section settings-panel__rules">
          <h3 className="settings-panel__section-title">How to play</h3>
          <ul className="settings-panel__rules-list">
            <li>Win small boards to claim their cell on the big board.</li>
            <li>Your move's position sends your opponent to that small board.</li>
            <li>If that board is closed, they choose freely.</li>
            <li>Win three big-board cells in a row to win.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
