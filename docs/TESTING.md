# xo-plus — Testing Documentation

**Document status:** Draft v1.0
**Last updated:** 2026-06-04
**Related:** [[DEVELOPMENT_PLAN]] · [[GAME_DESIGN_DOCUMENT]] · [[DOCS_WIKI]]
**Plain links:** [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) · [GAME_DESIGN_DOCUMENT.md](./GAME_DESIGN_DOCUMENT.md)

How we verify xo-plus is correct, playable, and on-aesthetic. This document maps directly to the phases and acceptance gates in [[DEVELOPMENT_PLAN]] and to the rules checklist in [[GAME_DESIGN_DOCUMENT]] §10.

---

## 1. Testing philosophy

- **The rules engine is pure and gets the most rigorous testing.** It has no UI dependencies, so it's fast and exhaustively unit-testable. A bug here corrupts every game; a bug in CSS does not.
- **Test the engine deeply, the UI behaviorally, the feel manually.** Logic → automated; interactions → component tests; aesthetics & ergonomics → human review.
- **The engine tests are written in [[DEVELOPMENT_PLAN]] Phase 1 and must stay green forever after.** They double as the regression suite reused by the v2 server.

---

## 2. Test layers

| Layer | Tooling | What it covers | Plan phase |
|-------|---------|----------------|------------|
| **Unit — engine** | Vitest | Rules logic: legality, next-active-board, win/draw, undo. | Phase 1 |
| **Unit — helpers/UI logic** | Vitest | Reducers, pure UI helpers, formatting. | Phases 2, 5 |
| **Component** | Vitest + React Testing Library | Rendering from state, click/tap to place, highlights, end-state banner. | Phases 2, 5 |
| **Manual / exploratory** | Human | Full play-throughs, rule readability. | Phase 2.9 gate |
| **Aesthetic review** | Human (you) | Paper/pencil look, colors, animations. | Phase 3.9 gate |
| **Device / touch** | Human (your phone) | Ergonomics, tap targets, send-preview. | Phase 4.5 gate |
| **Accessibility** | axe / Lighthouse + manual | Keyboard nav, ARIA, contrast, colorblind-safe. | Phase 6.1–6.3 |
| **Cross-browser / perf** | Manual + Lighthouse | Chrome/Safari/Firefox, bundle/render perf. | Phase 6.4–6.5 |
| **Server (v2)** | Vitest + integration | Room lifecycle, server-authoritative validation, reconnect. | Phase 9.7 |
| **End-to-end (v2)** | Two-device manual | Live online match across devices. | Phase 10.7 gate |

---

## 3. Engine test checklist (authoritative)

These are the cases from [[GAME_DESIGN_DOCUMENT]] §10. Each must have a passing automated test before Phase 1's acceptance gate.

- [ ] First move is unrestricted (any cell, any board).
- [ ] A move in cell *p* sends the opponent to board *p*.
- [ ] Forced move: opponent cannot play outside the active board when it's open.
- [ ] **Free move when sent to a won board.**
- [ ] **Free move when sent to a drawn (full) board.**
- [ ] Free move allows any *open* board but **not** a closed one.
- [ ] Winning a small board closes it and locks its cells.
- [ ] A drawn small board closes and counts for neither player.
- [ ] Big-board win detected on each of the 8 lines; game ends immediately.
- [ ] Game draw when all boards closed with no winning big-board line.
- [ ] Cannot play in a closed board, ever.
- [ ] Cannot play in an occupied cell.
- [ ] Undo restores active board and board statuses correctly.

**Additional engine cases to cover:**
- [ ] `applyMove` is immutable (does not mutate the input state).
- [ ] `getLegalMoves` returns exactly the legal set in: first move, forced move, and free-move situations.
- [ ] Replaying a full recorded move sequence reproduces an identical final state (determinism).
- [ ] Big-board win takes precedence / ends the game even if other boards remain open.

---

## 4. Acceptance gates (per [[DEVELOPMENT_PLAN]])

Each gate is a human 🧑 sign-off. Testing exists to make these gates pass with confidence.

| Gate | From plan | Test evidence required |
|------|-----------|------------------------|
| Engine correct | Phase 1 | All §3 checklist tests green; high coverage report. |
| Playable | Phase 2 | Manual full game; component tests for place/highlight/end. |
| On-aesthetic | Phase 3 | Your visual sign-off; reduced-motion verified. |
| Mobile-ready | Phase 4 | Real-device play in portrait; touch send-preview works. |
| Game loop complete | Phase 5 | Undo/restart/victory tested. |
| v1 ship | Phase 6 | A11y + cross-browser + perf pass; deployed URL; final playtest. |
| v2 server | Phase 9 | Server tests; illegal/out-of-turn moves rejected. |
| v2 ship | Phase 12 | Two-device E2E; security review. |

---

## 5. Commands (once scaffolded)

To be confirmed when the project is set up in [[DEVELOPMENT_PLAN]] Phase 0:

```bash
npm test          # run unit + component tests (Vitest)
npm run test:watch  # watch mode during development
npm run lint      # ESLint
npm run build     # production build (must succeed before ship)
```

---

## 6. Continuous testing expectations

- Engine and component tests run on every change; **the engine suite must always be green** — treat a red engine test as a release blocker.
- New rules behavior ⇒ new/updated test in §3 **and** an updated row here.
- When a doc-affecting change lands, follow the maintenance rules in [[DOCS_WIKI]] (bump dates, keep the index in sync).
