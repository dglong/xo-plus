# XO Plus

**Ultimate Tic-Tac-Toe** — the classic game, leveled up. A 3×3 board where *every cell is its own 3×3 tic-tac-toe board*. Where you play inside a small board decides which board your opponent must play in next. It's simple to learn, surprisingly deep, and a lot more fun than it has any right to be.

> 🎨 Warm, paper-y, hand-drawn look. 📱 Mobile-first. 🤝 Local hot-seat (two players, one device).

---

## How to play

1. The big board has **9 small boards**. Win a small board to claim its cell on the big board.
2. **Win 3 cells in a row** on the big board (across, down, or diagonally) and you win the game.
3. Here's the twist: **the cell you play in sends your opponent to the matching small board.** Play in the top-right cell of any board, and your opponent must play in the top-right board next.
4. If you're sent to a board that's already finished, you get a **free move** — play anywhere.

That one rule turns every move into a trade-off: take the square you want, or deny your opponent the board they'd love to play in.

---

## Why this project exists

This is a **hobby project** — a sandbox for experimenting with [Claude Code](https://claude.com/claude-code) as a coding collaborator. The goal was less "ship a product" and more "see how far an AI pair-programmer can carry a real, fully-specced project" — from game-design docs and a tested rules engine through to a polished, accessible UI.

So if you're poking around: the docs, the phased plan, the tests, and the commit history are all part of the experiment. 🧪

---

## Tech stack

- **TypeScript + React** (via Vite)
- **SCSS** for styling, with design tokens for the paper/pencil aesthetic
- **Vitest** + Testing Library for the rules engine and components
- No backend — everything runs in the browser

---

## Running it locally

```bash
npm install      # install dependencies
npm run dev      # start the dev server (Vite will print a local URL)
```

Other handy scripts:

```bash
npm run build      # production build into dist/
npm run preview    # preview the production build
npm run test       # run tests in watch mode
npm run test:run   # run tests once
npm run lint       # lint the source
npm run format     # auto-format with Prettier
```

---

## Roadmap

- **v1** — Local hot-seat (two players sharing one device) ✅ *current*
- **v2** — Online multiplayer over WebSockets 🔜

---

## Documentation

Deeper design and planning docs live in [`docs/`](docs/):

| Doc | What's in it |
|-----|--------------|
| [Docs Wiki](docs/DOCS_WIKI.md) | Hub linking every document — start here |
| [Game Design Document](docs/GAME_DESIGN_DOCUMENT.md) | Full rules, terminology, state model, art direction |
| [Development Plan](docs/DEVELOPMENT_PLAN.md) | Phased build plan with acceptance gates |
| [Testing](docs/TESTING.md) | Test strategy and coverage |
| [Progress Tracker](docs/PROGRESS.md) | Living checklist of what's done |

---

*Built for fun. 🎲*
