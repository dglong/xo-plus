# xo-plus — Game Design Document

**Working title:** xo-plus
**Genre:** Abstract strategy / turn-based board game
**Players:** 2 (local hot-seat for v1; online for v2 — see Scope)
**Stack:** TypeScript + React + Vite, SCSS for styling. Mobile-first.
**Art direction:** Minimal, warm-toned, "paper-y" vibe with pencil-stroke marks.
**Document status:** Draft v1.1
**Last updated:** 2026-06-04

---

## 1. High Concept

xo-plus is tic-tac-toe nested inside tic-tac-toe. The board is a 3×3 grid of **boards**, and each of those nine boards is itself a 3×3 grid of **cells**. Every move you make doesn't just claim a cell — it *sends your opponent* to a specific board, because the position you played inside a small board dictates which small board the opponent must play in next.

The result is a game that looks like noughts-and-crosses but plays like a strategic duel: you're constantly choosing between making progress on the board in front of you and controlling where you force your opponent to go next.

> This design is the game commonly known as **Ultimate Tic-Tac-Toe** (a.k.a. Super Tic-Tac-Toe / Meta Tic-Tac-Toe). This GDD specifies the rules, edge cases, UX, and a build plan for the xo-plus implementation.

---

## 2. Terminology

To keep the rest of the document unambiguous, we fix these terms:

| Term | Meaning |
|------|---------|
| **Cell** | The smallest unit. A single square that one player can mark with X or O. |
| **Small board** (or *board*) | A 3×3 arrangement of 9 cells. There are 9 small boards. |
| **Big board** (or *meta board*) | The overall 3×3 arrangement of the 9 small boards. |
| **Mark** | An X or an O placed in a cell. |
| **Win a small board** | Get 3 marks in a row (horizontal, vertical, or diagonal) within a small board. The winner *acquires* that board's position on the big board. |
| **Win the game** | Acquire 3 small boards in a row on the big board. |
| **Active board** | The small board the current player is required to play in. |
| **Sent / forced** | A player is "sent" to the active board by the opponent's previous move. |
| **Free move** | A turn where the player may choose *any* legal cell on *any* playable board (see §3.4). |
| **Closed board** | A small board that is already won or drawn — no more moves allowed there. |

The big board uses position indices 0–8 (top-left to bottom-right), and so does each small board:

```
 0 | 1 | 2
---+---+---
 3 | 4 | 5
---+---+---
 6 | 7 | 8
```

---

## 3. Rules

### 3.1 Setup
- An empty big board: 9 small boards, each with 9 empty cells (81 cells total).
- Player 1 is **X**, Player 2 is **O**. X moves first (convention; configurable).

### 3.2 The first move
- The first player (X) may play **any cell in any small board**. The opening move is unrestricted.
  - *(Optional house rule, see §6: forbid the very first move from being the center cell of the center board, which is considered too strong. Off by default.)*

### 3.3 The core mechanic — "your move chooses my board"
The cell *position* you play within a small board determines which small board your opponent must play in next.

- If X plays in the **center cell** (position 4) of any small board, O must next play in the **center small board** (big-board position 4).
- If X plays the **top-right cell** (position 2), O must play in the **top-right small board** (position 2).
- In general: a move in cell position *p* of any small board sends the opponent to small board *p* on the big board.

So the position index of the cell maps directly to the position index of the next active board.

### 3.4 Free moves (the critical edge case)
A player is normally forced into the active board. **But** if the active board is **closed** (already won or drawn), the forcing rule cannot apply. In that case the move becomes a **free move**:

- The sent player may play in **any open board** of their choice (any board that is not closed), in any empty cell.

This is the single most important edge-case rule and a frequent source of bugs and confusion. xo-plus uses the standard ruling: **sent to a finished board ⇒ free move.**

> **Design decision (documented):** We do *not* use the alternative variant where being sent to a won board ends the game or skips the turn. Free-move-on-closed-board is the widely accepted standard and produces the best strategic depth.

### 3.5 Winning a small board
- The first player to make 3-in-a-row within a small board **acquires** that board.
- The board is then **closed**; the acquiring player's symbol is shown over the whole board on the big board.
- Cells in a closed board are locked; no further marks may be placed there.

### 3.6 Drawn small boards
- If a small board fills with no 3-in-a-row, it is a **draw** and becomes **closed**, owned by *neither* player.
- A drawn board counts for *neither* player when evaluating big-board lines. (See §6 for an optional "draws count for both" variant — off by default.)

### 3.7 Winning the game
- A player wins by acquiring **3 small boards in a row** on the big board (horizontal, vertical, or diagonal).
- The game ends immediately when this happens.

### 3.8 Drawing the game
The game is a draw if neither player can achieve 3 acquired boards in a row. Practically, this is declared when:
- All 9 small boards are closed (won or drawn), and
- No player holds a winning line of 3 acquired boards.

*(An "early draw" detection — when no winning big-board line is still mathematically possible — is a nice-to-have optimization, not required for correctness.)*

### 3.9 Turn flow (summary)
```
1. Determine the active board:
   - If opponent's last move pointed to an OPEN board → that is the active board.
   - If it pointed to a CLOSED board, or it's the first move → FREE MOVE (any open board).
2. Current player places a mark in an empty cell of a legal board.
3. Check the small board that was just played:
   - 3-in-a-row → current player acquires it; close it; check big-board win.
   - full with no win → draw; close it.
4. If game-win → end. If all boards closed → draw. Else swap players, go to 1.
```

---

## 4. State Model

A clean, implementation-ready representation:

```
GameState
├── bigBoard: SmallBoard[9]
├── boardStatus: Status[9]        // OPEN | WON_X | WON_O | DRAW   (derived, cached)
├── currentPlayer: X | O
├── activeBoard: int | null       // null = free move
├── winner: X | O | DRAW | null   // null = in progress
└── moveHistory: Move[]           // for undo / replay / analysis

SmallBoard
└── cells: (X | O | EMPTY)[9]

Move
├── player: X | O
├── boardIndex: 0..8
└── cellIndex: 0..8
```

**Move legality predicate** — a move `(boardIndex, cellIndex)` by `currentPlayer` is legal iff:
1. `boardStatus[boardIndex] == OPEN`, and
2. `cell` at `(boardIndex, cellIndex)` is `EMPTY`, and
3. `activeBoard == null` (free move) **or** `boardIndex == activeBoard`.

**Next active board** after a move in `cellIndex`:
- `next = cellIndex`
- if `boardStatus[next] != OPEN` → `activeBoard = null` (free move)
- else → `activeBoard = next`

Keeping `boardStatus` and `winner` as derived-but-cached values (recomputed on each move) keeps win-checking O(1)-ish and avoids rescanning 81 cells.

---

## 5. UX / Presentation

### 5.0 Art direction — "warm paper & pencil"
The whole game should feel like it's being sketched in a warm notebook.

- **Palette:** off-white / cream paper background (e.g. `#f4ecd8`-ish), warm neutrals, soft graphite for lines. Two restrained accent colors for X and O — e.g. a warm terracotta/red for X and a muted blue-teal for O — kept desaturated so they sit on the page rather than glow.
- **Texture:** subtle paper grain on the background; faint deckle/edge shadow on the board container.
- **Strokes:** grid lines and X/O marks rendered as hand-drawn pencil strokes (slightly wobbly, variable weight, soft ends). Marks "draw on" with a quick stroke animation rather than popping in.
- **Typography:** a humanist or hand-lettered display face for headings; clean readable sans for HUD/numbers. Keep it minimal — lots of breathing room.
- **Implementation notes:** prefer SVG for the strokes (stroke-dasharray/`pathLength` animation for the draw-on effect; slight per-instance path jitter for the hand-drawn look). Paper grain via a tiling PNG/SVG-noise overlay at low opacity. Respect `prefers-reduced-motion` (skip stroke animations).

### 5.0b Mobile-first layout
Designed for a portrait phone screen first, scaling up to tablet/desktop.

- The 9×9 playing surface is the hero element and should fill the available width on phones, remaining tappable. Target comfortable tap targets (≈44px min) per cell where possible; on the smallest screens, lean on zoom/focus of the active board if cells get too small.
- HUD (current player, "play here" hint, score) sits in a compact bar above or below the board — not crowding it.
- Single-column on phones; board + side panel on wider screens.
- Touch interactions: tap to place. Since there's no hover on touch, the **send-preview** (§5.3) becomes a *tap-to-preview, tap-again-to-confirm* affordance on touch devices (or a long-press preview), while desktop keeps hover-preview.
- Use `dvh`/safe-area insets so the board isn't hidden behind mobile browser chrome.

### 5.1 Visual hierarchy
The player must, at a glance, understand three layers:
1. **Where am I allowed to play?** — the active board(s) must be unmistakable.
2. **What's the small-board situation?** — individual X/O marks.
3. **Who's winning the meta game?** — acquired boards.

### 5.2 Key visual states
| State | Treatment (suggested) |
|-------|------------------------|
| Active board (forced) | Bright highlight / glow border; the rest dimmed. |
| Free move available | All open boards highlighted (e.g. soft outline) so the player knows it's their choice. |
| Open, not active | Normal but de-emphasized. |
| Won board | Filled with a large translucent X or O in the owner's color; cells locked/greyed. |
| Drawn board | Neutral hatch/grey fill; marked as dead. |
| Last move | A distinct marker/pulse so the opponent can see what just happened (and thus why they're sent where they are). |
| Hover (legal) | Ghost preview of the mark + a hint of which board it will send the opponent to. |
| Hover (illegal) | "Not allowed" cursor / no preview. |

### 5.3 "Send preview" — a signature feature
On hover over a legal cell, subtly highlight the small board the opponent *would* be sent to. This teaches the core mechanic and supports planning. This is xo-plus's standout UX touch.

### 5.4 Feedback & juice
- Animate mark placement.
- A satisfying "board acquired" animation when a small board is won (the large symbol stamps in).
- Victory animation drawing the winning big-board line.
- Sound: place, acquire, win, illegal-move cues.

### 5.5 Information / HUD
- Current player indicator.
- Whose turn + "You must play in the highlighted board" / "Free move — choose any board."
- Acquired-board score (X: n, O: m).
- Move counter; optional move history / undo (local play).

### 5.6 Accessibility
- Don't rely on color alone — use symbol shape + patterns for X/O ownership.
- Colorblind-safe palette option.
- Keyboard navigation: arrow keys to move focus across boards/cells, Enter to place.
- Clear focus outlines; sufficient contrast; screen-reader labels like "Board top-left, cell center, empty, legal."

---

## 6. Configurable Rules / Variants

Ship with sensible defaults; expose toggles for replayability:

| Option | Default | Description |
|--------|---------|-------------|
| First-move center restriction | Off | Forbid opening in center cell of center board. |
| Drawn board ownership | Neither | Variant: a drawn board counts for *both* players in big-board lines. |
| Send-to-won handling | Free move | (Locked as standard; documented alternative variants exist but are not recommended.) |
| Who goes first | X | Allow O-first or random. |
| Board size | 3×3×3×3 | (Stretch) generalize to N×N for experimentation. |

---

## 7. Game Modes & Scope

**MVP (v1) — local hot-seat:**
- Local 2-player on one device, players alternating on the same screen (pass-and-play / "switch local seat").
- Full rules incl. free-move edge case, win/draw detection.
- Core UX: active-board highlighting, send-preview, win animations.
- Mobile-first layout and touch interactions.
- Undo + new game.

**v2 — online multiplayer:**
- WebSocket-based server for real-time 2-player matches.
- Lobby / room codes to pair players; reconnection handling.
- Server-authoritative game state (validate moves server-side).
- (Optional) Single-player vs. AI (see §8) and difficulty levels.
- Settings screen with variants from §6.

**v3 (stretch):**
- Match history, stats, simple ranking.
- Replays / shareable game codes.
- Async ("correspondence") matches.

---

## 8. AI Opponent (v2)

Recommended progression of opponent strength:

1. **Random legal move** — trivial baseline / "easy".
2. **Heuristic / greedy** — score moves by: win a board, block opponent's board win, win the game, avoid sending opponent to a board where they can win, prefer sending opponent to closed/own-favorable boards, value center boards/cells.
3. **Minimax + alpha-beta** with a depth limit and the heuristic above as the evaluation function. The branching factor (≤ ~9 per move, often fewer when forced) makes shallow search very tractable; forced moves prune the tree naturally.
4. **MCTS (stretch)** — Monte Carlo Tree Search scales well here and gives strong, tunable play without a hand-built evaluation function.

Difficulty = search depth / iteration count + how often the AI plays the best move vs. a random one.

---

## 9. Technical Notes

- **Pure, testable core:** keep all rules logic (state, legality, win detection, next-active-board) in a framework-agnostic module with no rendering dependencies. The UI consumes it.
- **Determinism:** game logic must be deterministic given a move sequence — enables replays, undo, networked sync, and AI search.
- **Win detection:** precompute the 8 winning lines (`[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]`) and reuse the same check for both small boards and the big board.
- **Stack (confirmed):** TypeScript + React + Vite, SCSS for styling. Mobile-first, web-based.
  - **Core rules engine:** plain TypeScript, no React imports — pure functions over `GameState`. Lives in e.g. `src/engine/`. Unit-tested in isolation (Vitest).
  - **UI:** React function components + hooks. Game state managed via a reducer (`useReducer`) or a small store, dispatching `Move`s into the engine. This same engine is reused server-side in v2 for authoritative validation.
  - **Styling:** SCSS modules (or a global SCSS layer with BEM-ish naming). Design tokens (paper color, accents, spacing, stroke widths) as SCSS variables / CSS custom properties so theming stays centralized.
  - **Rendering the board:** SVG for grid + pencil-stroke marks (enables draw-on stroke animation and hand-drawn jitter); DOM/React for HUD and overlays.
  - **v2 server:** Node + `ws` (or Socket.IO) sharing the same TS engine package for move validation.

---

## 10. Testing Checklist (rules correctness)

These are the cases an implementation must get right:

- [ ] First move is unrestricted (any cell, any board).
- [ ] A move in cell *p* sends opponent to board *p*.
- [ ] Forced move: opponent cannot play outside the active board when it's open.
- [ ] **Free move when sent to a won board.**
- [ ] **Free move when sent to a drawn (full) board.**
- [ ] Free move lets the player pick any *open* board but **not** a closed one.
- [ ] Winning a small board closes it and locks its cells.
- [ ] A drawn small board closes and counts for neither player.
- [ ] Big-board win on each of the 8 lines ends the game immediately.
- [ ] Game draw when all boards closed with no winning big-board line.
- [ ] You cannot play in a closed board, ever.
- [ ] You cannot play in an occupied cell.
- [ ] Undo restores active board and board statuses correctly.

---

## 11. Decisions Locked & Remaining Questions

**Locked in (v1.1):**
- ✅ **Stack:** TypeScript + React + Vite, SCSS. Mobile-first.
- ✅ **Scope:** v1 = local hot-seat (switch local seat); v2 = WebSocket online multiplayer (+ optional AI).
- ✅ **Art direction:** minimal, warm-toned, paper-y with pencil strokes.

**Still open (can default these and revisit):**
1. **X/O accent colors** — proposed terracotta (X) + muted blue-teal (O). OK, or different warm pairing?
2. **Variant defaults** — keep all optional rules (§6) off by default? (Assumed yes.)
3. **Undo policy** — unlimited undo in local play, or none/limited? (Assumed unlimited for v1.)

---

*End of document.*
