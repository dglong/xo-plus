# xo-plus — Development Progress Tracker

**Document status:** Living document
**Last updated:** 2026-06-05 (Phase 1 complete)
**Related:** [[DEVELOPMENT_PLAN]] · [[TESTING]] · [[DOCS_WIKI]] — plain: [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)

Shared, living checklist of what's built and what isn't. Mirrors the phases/tasks of [[DEVELOPMENT_PLAN]] one-to-one. **Both of us update this file** as work lands — it's the single source of truth for "where are we."

---

## How to use this file

- **Status values:** `⬜ Not started` · `🟡 In progress` · `✅ Done` · `🚧 Blocked` · `⏭️ Skipped/Deferred`
- When a task changes state, update its **Status** and **Notes** (e.g. blocker reason, PR/commit, date).
- When all tasks in a phase are ✅ and its acceptance gate is signed off, mark the **phase header** ✅.
- Bump **Last updated** (here, in `CLAUDE.md`, and in [[DOCS_WIKI]]) on every edit — see [[DOCS_WIKI]] maintenance rules.
- Task numbers (e.g. `1.5`) match [[DEVELOPMENT_PLAN]] exactly. If the plan changes, reconcile here.

---

## Snapshot

| | |
|---|---|
| **Current version target** | v1 — Local Hot-Seat |
| **Current phase** | Phase 2 — Functional UI |
| **Overall v1 progress** | 1 / 6 phases complete |
| **Overall v2 progress** | 0 / 6 phases complete |
| **Last activity** | 2026-06-05 — Phase 1 engine complete (43 unit tests green) |
| **Next up** | Phase 2 — Functional UI (2.1 useReducer → 2.8 end-state banner) |

---

# v1 — Local Hot-Seat

## Phase 0 — Scaffolding & Tooling  ⬜

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 0.1 | Init Vite + React + TypeScript | 🤖 AFK | ✅ | Vite 5 + react-ts, manual scaffold |
| 0.2 | SCSS + folder structure | 🤖 AFK | ✅ | sass, src/{engine,ui,styles,assets} |
| 0.3 | Vitest + React Testing Library | 🤖 AFK | ✅ | vitest 2 + RTL 16 + jsdom |
| 0.4 | ESLint + Prettier + TS strict | 🤖 AFK | ✅ | eslint 8 + prettier 3 + strict tsconfig |
| 0.5 | npm scripts | 🤖 AFK | ✅ | dev, build, preview, test, test:run, lint, format |
| 0.6 | git init / remote | 🧑 HITL | 🟡 | git init + initial commit done; remote pending (user to create GitHub repo) |
| 0.7 | Choose deploy target | 🧑 HITL | ✅ | Netlify — netlify.toml added |
| — | **Acceptance gate:** dev server + tests run | 🧑 | 🟡 | build ✅, vitest runs ✅ — run `npm run dev` to verify locally |

## Phase 1 — Core Rules Engine  ✅

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 1.1 | Types & state model | 🤖 AFK | ✅ | `src/engine/types.ts` |
| 1.2 | `createInitialState()` | 🤖 AFK | ✅ | `src/engine/state.ts` |
| 1.3 | Win-lines + `lineWinner()` | 🤖 AFK | ✅ | `src/engine/constants.ts` + `state.ts` |
| 1.4 | `getLegalMoves` / `isLegalMove` | 🤖 AFK | ✅ | `src/engine/rules.ts` |
| 1.5 | `applyMove` (immutable) | 🤖 AFK | ✅ | `src/engine/rules.ts` |
| 1.6 | `getActiveBoard` / free-move | 🤖 AFK | ✅ | Inlined in `applyMove`; null = free move |
| 1.7 | Win/draw resolution | 🤖 AFK | ✅ | `resolveGame` in `state.ts` |
| 1.8 | Undo (history) | 🤖 AFK | ✅ | `undo` in `rules.ts` — replays history |
| 1.9 | Unit tests (GDD §10 checklist) | 🤖 AFK | ✅ | 43 tests green — `src/engine/__tests__/engine.test.ts` |
| — | **Acceptance gate:** all §10 tests green | 🧑 | ✅ | 2026-06-05 — 43/43 pass |

## Phase 2 — Functional UI  ⬜

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 2.1 | `useReducer` over engine | 🤖 AFK | ⬜ | |
| 2.2 | Component tree | 🤖 AFK | ⬜ | |
| 2.3 | Render 9×9 from state | 🤖 AFK | ⬜ | |
| 2.4 | Tap/click to place | 🤖 AFK | ⬜ | |
| 2.5 | Active-board + free-move highlight | 🤖 AFK | ⬜ | |
| 2.6 | HUD (player/hint/score) | 🤖 AFK | ⬜ | |
| 2.7 | Won/drawn board overlay | 🤖 AFK | ⬜ | |
| 2.8 | End-state banner + New game | 🤖 AFK | ⬜ | |
| 2.9 | Play-through review | 🧑 HITL | ⬜ | |
| — | **Acceptance gate:** full game playable | 🧑 | ⬜ | |

## Phase 3 — Art Direction (paper & pencil)  ⬜

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 3.1 | Design tokens (SCSS/CSS vars) | 🤖 AFK | ⬜ | |
| 3.2 | Paper background + grain | 🤝 MIXED | ⬜ | |
| 3.3 | Pencil-stroke SVG X/O | 🤝 MIXED | ⬜ | |
| 3.4 | Draw-on animation + reduced-motion | 🤖 AFK | ⬜ | |
| 3.5 | Pencil grid lines | 🤖 AFK | ⬜ | |
| 3.6 | Won-board stamp + drawn treatment | 🤝 MIXED | ⬜ | |
| 3.7 | Last-move indicator | 🤖 AFK | ⬜ | |
| 3.8 | Typography choices | 🧑 HITL | ⬜ | 2–3 font options |
| 3.9 | Color & feel review | 🧑 HITL | ⬜ | X/O accents |
| — | **Acceptance gate:** matches aesthetic | 🧑 | ⬜ | |

## Phase 4 — Mobile-First & Touch  ⬜

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 4.1 | Responsive layout | 🤖 AFK | ⬜ | |
| 4.2 | `dvh` + safe-area | 🤖 AFK | ⬜ | |
| 4.3 | Tap-target sizing / small-screen | 🤖 AFK | ⬜ | |
| 4.4 | Touch send-preview interaction | 🤝 MIXED | ⬜ | |
| 4.5 | Real-device testing | 🧑 HITL | ⬜ | Your phone |
| — | **Acceptance gate:** comfortable on phone | 🧑 | ⬜ | |

## Phase 5 — Game Flow & Meta  ⬜

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 5.1 | Restart / new game | 🤖 AFK | ⬜ | |
| 5.2 | Victory line animation | 🤖 AFK | ⬜ | |
| 5.3 | Undo button | 🤖 AFK | ⬜ | |
| 5.4 | Settings (variant toggles) | 🤝 MIXED | ⬜ | Confirm which ship in v1 |
| 5.5 | Sound effects + mute | 🧑 HITL | ⬜ | Optional; may cut |
| 5.6 | Local persistence (resume) | 🤖 AFK | ⬜ | Nice-to-have |
| — | **Acceptance gate:** loop complete | 🧑 | ⬜ | |

## Phase 6 — QA, A11y, Ship  ⬜

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 6.1 | Keyboard navigation | 🤖 AFK | ⬜ | |
| 6.2 | ARIA / screen-reader labels | 🤖 AFK | ⬜ | |
| 6.3 | Contrast + colorblind-safe | 🤖 AFK | ⬜ | |
| 6.4 | Cross-browser smoke test | 🤝 MIXED | ⬜ | |
| 6.5 | Performance pass | 🤖 AFK | ⬜ | |
| 6.6 | Production build config | 🤖 AFK | ⬜ | |
| 6.7 | Deploy to public URL | 🧑 HITL | ⬜ | Hosting creds |
| 6.8 | Final acceptance playtest | 🧑 HITL | ⬜ | |
| — | **v1 SHIP GATE** | 🧑 | ⬜ | |

---

# v2 — Online Multiplayer

*Not started until v1 ships.*

## Phase 7 — Architecture & Decisions  ⬜

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 7.1 | Transport: `ws` vs Socket.IO | 🧑 HITL | ⬜ | |
| 7.2 | Server hosting choice | 🧑 HITL | ⬜ | |
| 7.3 | Persistence (in-memory vs DB) | 🧑 HITL | ⬜ | |
| 7.4 | Auth model | 🧑 HITL | ⬜ | |
| — | **Acceptance gate:** `ARCHITECTURE.md` written | 🧑 | ⬜ | New doc → index it |

## Phase 8 — Shared Engine Package  ⬜

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 8.1 | Extract engine to shared module | 🤖 AFK | ⬜ | |
| 8.2 | Environment-agnostic (no DOM) | 🤖 AFK | ⬜ | |
| 8.3 | Server reuse of validation | 🤖 AFK | ⬜ | |

## Phase 9 — Game Server  ⬜

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 9.1 | WebSocket server skeleton | 🤖 AFK | ⬜ | |
| 9.2 | Room lifecycle (create/join/leave) | 🤖 AFK | ⬜ | |
| 9.3 | Pairing + seat assignment | 🤖 AFK | ⬜ | |
| 9.4 | Server-authoritative validation | 🤖 AFK | ⬜ | |
| 9.5 | Disconnect/reconnect | 🤖 AFK | ⬜ | |
| 9.6 | Anti-cheat basics | 🤖 AFK | ⬜ | |
| 9.7 | Server tests | 🤖 AFK | ⬜ | |
| 9.8 | Load/edge review | 🧑 HITL | ⬜ | |
| — | **Acceptance gate:** illegal moves rejected | 🧑 | ⬜ | |

## Phase 10 — Client Networking  ⬜

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 10.1 | Networking layer | 🤖 AFK | ⬜ | |
| 10.2 | Lobby UI (create/join/share) | 🤝 MIXED | ⬜ | |
| 10.3 | Online sync + waiting states | 🤖 AFK | ⬜ | |
| 10.4 | Optimistic move + reconciliation | 🤖 AFK | ⬜ | |
| 10.5 | Connection status / reconnect UI | 🤖 AFK | ⬜ | |
| 10.6 | Mode select (Local vs Online) | 🤝 MIXED | ⬜ | |
| 10.7 | Two-device live playtest | 🧑 HITL | ⬜ | |
| — | **Acceptance gate:** live match works | 🧑 | ⬜ | |

## Phase 11 — (Optional) AI Opponent  ⬜

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 11.1 | Random-move AI (easy) | 🤖 AFK | ⬜ | |
| 11.2 | Heuristic/greedy AI (medium) | 🤖 AFK | ⬜ | |
| 11.3 | Minimax + alpha-beta (hard) | 🤖 AFK | ⬜ | |
| 11.4 | Difficulty selector + tuning | 🤝 MIXED | ⬜ | |

## Phase 12 — v2 Hardening & Ship  ⬜

| # | Task | Tag | Status | Notes |
|---|------|-----|--------|-------|
| 12.1 | Server deployment + env config | 🧑 HITL | ⬜ | |
| 12.2 | Client → prod (CORS/WSS/TLS) | 🤖 AFK | ⬜ | |
| 12.3 | Monitoring/logging | 🤖 AFK | ⬜ | |
| 12.4 | Security review | 🤝 MIXED | ⬜ | |
| 12.5 | Final cross-device acceptance | 🧑 HITL | ⬜ | |
| — | **v2 SHIP GATE** | 🧑 | ⬜ | |

---

## Change log

Brief running notes of notable progress (newest first).

| Date | Update |
|------|--------|
| 2026-06-05 | Phase 1 complete: full rules engine (`types`, `constants`, `state`, `rules`) + 43 unit tests covering every GDD §10 checklist item. |
| 2026-06-04 | Phase 0 AFK tasks done: Vite+React+TS scaffold, SCSS, Vitest, ESLint, Prettier, folder structure. |
| 2026-06-04 | Docs set up (GDD, plan, testing, wiki, this tracker). No code yet. |
