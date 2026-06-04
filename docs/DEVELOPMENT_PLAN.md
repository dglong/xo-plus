# xo-plus — Development Plan

**Document status:** Draft v1.0
**Last updated:** 2026-06-04
**Related:** [[GAME_DESIGN_DOCUMENT]] · [[TESTING]] · [[DOCS_WIKI]] — plain: [`GAME_DESIGN_DOCUMENT.md`](./GAME_DESIGN_DOCUMENT.md), [`TESTING.md`](./TESTING.md)

This plan breaks delivery into **v1 (local hot-seat)** and **v2 (online multiplayer)**. Each task is tagged so we know who drives it.

---

## Legend

| Tag | Meaning |
|-----|---------|
| 🤖 **AFK** | *Away From Keyboard* — I can do this autonomously end-to-end. No input needed beyond the spec; you review the result whenever convenient. |
| 🧑 **HITL** | *Human In The Loop* — needs your decision, taste, credentials, or hands-on testing. Work pauses on you. |
| 🤝 **MIXED** | I build a first pass autonomously (AFK), then you review/iterate (HITL). Most UI/art work is here. |

**Dependency rule:** phases are mostly sequential; within a phase, tasks can sometimes parallelize. Each phase ends with an **acceptance gate** (🧑) where you sign off before we move on.

---

# Part A — v1: Local Hot-Seat

**Goal:** a polished, mobile-first, single-device 2-player game with the full ruleset, the warm paper/pencil art direction, win/draw detection, and undo. No network, no AI.

**Definition of Done (v1):** Two people can play a complete, rules-correct game on one phone or desktop browser, it looks like the intended paper/pencil aesthetic, it's accessible and responsive, and it's deployed to a public URL.

---

## Phase 0 — Scaffolding & Tooling  🤖 mostly AFK

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 0.1 | Init Vite + React + TypeScript project | 🤖 AFK | `npm create vite@latest` (react-ts template). |
| 0.2 | Add SCSS support + base folder structure (`src/engine`, `src/ui`, `src/styles`, `src/assets`) | 🤖 AFK | |
| 0.3 | Set up Vitest + React Testing Library | 🤖 AFK | Engine tests are the priority. |
| 0.4 | Set up ESLint + Prettier (+ TS strict mode) | 🤖 AFK | |
| 0.5 | Add npm scripts (`dev`, `build`, `test`, `lint`, `preview`) | 🤖 AFK | |
| 0.6 | `git init`, `.gitignore`, initial commit | 🧑 HITL | I'll prepare it; confirm you want a repo / remote (GitHub?). |
| 0.7 | Decide deployment target (Vercel / Netlify / GitHub Pages / Cloudflare Pages) | 🧑 HITL | One-line decision; affects build config later. |

**Acceptance gate:** `npm run dev` serves a blank app; `npm test` runs. 🧑

---

## Phase 1 — Core Rules Engine (pure TypeScript)  🤖 AFK

The heart of the game, framework-agnostic, fully unit-tested. **Reused verbatim by the v2 server.**

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 1.1 | Define types: `Player`, `Cell`, `SmallBoard`, `GameState`, `Move`, `Status` | 🤖 AFK | Per GDD §4. |
| 1.2 | `createInitialState()` | 🤖 AFK | Empty 81 cells, X to move, free first move. |
| 1.3 | Win-line constants + reusable `lineWinner()` helper | 🤖 AFK | Same 8 lines for small & big boards (GDD §9). |
| 1.4 | `getLegalMoves(state)` / `isLegalMove(state, move)` | 🤖 AFK | Active board, free move, occupied/closed checks. |
| 1.5 | `applyMove(state, move)` → new state | 🤖 AFK | Pure/immutable. Updates board status, big-board win, next active board (incl. free-move-on-closed). |
| 1.6 | `getActiveBoard(state)` / free-move detection | 🤖 AFK | |
| 1.7 | Win/draw resolution for game end | 🤖 AFK | Big-board win + all-closed draw (GDD §3.7–3.8). |
| 1.8 | Undo (history stack) | 🤖 AFK | |
| 1.9 | **Unit tests covering GDD §10 checklist** | 🤖 AFK | The full edge-case list, esp. free-move-on-won/drawn board. |

**Acceptance gate:** all §10 test cases pass; coverage on engine is high. 🧑 (you can just read the green test report)

---

## Phase 2 — Functional UI (unstyled-ish)  🤝 MIXED

Make it *playable* before making it *pretty*. Plain but correct.

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 2.1 | State management: `useReducer` wrapping the engine | 🤖 AFK | UI dispatches `Move`s; engine is source of truth. |
| 2.2 | Component tree: `App → Game → BigBoard → SmallBoard → Cell` + `HUD` | 🤖 AFK | |
| 2.3 | Render the 9×9 grid from state | 🤖 AFK | |
| 2.4 | Tap/click a cell to place a mark | 🤖 AFK | Illegal moves rejected/ignored. |
| 2.5 | Active-board highlight + free-move (all-open) highlight | 🤖 AFK | Core readability. |
| 2.6 | HUD: current player, "play here" hint, acquired-board score | 🤖 AFK | |
| 2.7 | Won/drawn board overlay (big symbol / dead state) | 🤖 AFK | Functional version; styling comes in Phase 3. |
| 2.8 | Win/draw end-state banner + "New game" | 🤖 AFK | |
| 2.9 | Play-through review | 🧑 HITL | You play a full game and confirm it *feels* right / rules read correctly. |

**Acceptance gate:** a full game is playable start-to-finish, rules visibly correct. 🧑

---

## Phase 3 — Art Direction: "warm paper & pencil"  🤝 MIXED (taste-heavy)

This is the most iterative, taste-driven phase. I produce candidates; you react.

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 3.1 | Design tokens in SCSS/CSS vars (paper color, accents, spacing, stroke widths) | 🤖 AFK | Centralized theming. |
| 3.2 | Paper background + subtle grain texture | 🤝 MIXED | I implement; you judge the warmth/texture. |
| 3.3 | X/O as hand-drawn **SVG pencil strokes** | 🤝 MIXED | Variable weight, soft ends, slight jitter. |
| 3.4 | Draw-on stroke animation (`stroke-dasharray`/`pathLength`) | 🤖 AFK | + `prefers-reduced-motion` fallback. |
| 3.5 | Grid lines as pencil strokes | 🤖 AFK | |
| 3.6 | Won-board "stamp" animation + drawn-board treatment | 🤝 MIXED | |
| 3.7 | Last-move indicator (pulse/marker) | 🤖 AFK | Helps explain "why am I sent here". |
| 3.8 | Typography (hand-lettered headings + clean HUD font) | 🧑 HITL | Font choice is taste; I'll propose 2–3 options. |
| 3.9 | **Color & feel review round(s)** | 🧑 HITL | X/O accents (terracotta/teal?), overall vibe. Expect 1–2 iterations. |

**Acceptance gate:** the game matches the intended aesthetic to your satisfaction. 🧑

---

## Phase 4 — Mobile-First Layout & Touch  🤝 MIXED

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 4.1 | Responsive layout: board as hero, single-column phone → side panel on desktop | 🤖 AFK | |
| 4.2 | `dvh` + safe-area insets (mobile browser chrome) | 🤖 AFK | |
| 4.3 | Tap-target sizing / small-screen handling | 🤖 AFK | Possibly active-board focus/zoom on tiny screens. |
| 4.4 | Touch **send-preview**: tap-to-preview → tap-again-confirm (or long-press) | 🤝 MIXED | Desktop keeps hover-preview. You feel-test the interaction. |
| 4.5 | **Real-device testing** (your phone) | 🧑 HITL | I can't tap your physical device; you verify ergonomics. |

**Acceptance gate:** comfortable to play on your phone in portrait. 🧑

---

## Phase 5 — Game Flow & Meta Features  🤝 MIXED

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 5.1 | Restart / new game with confirm | 🤖 AFK | |
| 5.2 | Victory line animation across the big board | 🤖 AFK | |
| 5.3 | Undo button (unlimited for v1) | 🤖 AFK | Wired to engine history. |
| 5.4 | Settings panel: variant toggles from GDD §6 | 🤝 MIXED | Could defer some toggles; confirm which ship in v1. |
| 5.5 | Sound effects (place / acquire / win / illegal) + mute | 🧑 HITL | Optional; needs asset choices. Could cut from v1. |
| 5.6 | Local persistence (resume in-progress game via `localStorage`) | 🤖 AFK | Nice-to-have. |

**Acceptance gate:** game loop feels complete and friendly. 🧑

---

## Phase 6 — QA, Accessibility, Polish & Ship  🤝 MIXED

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 6.1 | Keyboard navigation (arrow-move focus, Enter to place) | 🤖 AFK | |
| 6.2 | ARIA labels / screen-reader board descriptions | 🤖 AFK | |
| 6.3 | Color-contrast + colorblind-safe check (don't rely on color alone) | 🤖 AFK | |
| 6.4 | Cross-browser smoke test (Chrome/Safari/Firefox) | 🤝 MIXED | I check what I can; you confirm on your devices. |
| 6.5 | Performance pass (bundle size, render perf, Lighthouse) | 🤖 AFK | |
| 6.6 | Production build config for chosen host | 🤖 AFK | Depends on Phase 0.7 decision. |
| 6.7 | **Deploy to public URL** | 🧑 HITL | Needs your hosting account / auth. I'll script it; you authorize. |
| 6.8 | **Final acceptance playtest** | 🧑 HITL | Sign-off that v1 is done. |

**v1 ship gate:** deployed, accessible, mobile-first, rules-correct, on-aesthetic. 🧑

---

## v1 At-a-Glance

| Phase | Theme | Dominant mode |
|-------|-------|---------------|
| 0 | Scaffolding | 🤖 AFK (2 quick 🧑 decisions) |
| 1 | Rules engine | 🤖 AFK |
| 2 | Functional UI | 🤝 MIXED |
| 3 | Paper/pencil art | 🤝 MIXED (taste-heavy 🧑) |
| 4 | Mobile & touch | 🤝 MIXED (device test 🧑) |
| 5 | Game flow | 🤝 MIXED |
| 6 | QA & ship | 🤝 MIXED (deploy 🧑) |

**The big autonomous block:** Phases 0–2 can run almost entirely AFK — I can deliver a fully playable (if plain) game with a tested engine before you need to engage. Your involvement concentrates in **Phase 3 (aesthetic taste)**, **Phase 4.5 (device feel)**, and **Phase 6.7–6.8 (deploy + sign-off)**.

---

# Part B — v2: Online Multiplayer

*Starts after v1 ships and is signed off.* Goal: two people on different devices play in real time, with the server as the source of truth. Reuses the v1 engine unchanged.

**Definition of Done (v2):** Two players on separate devices can create/join a room by code, play a full real-time game with moves validated server-side, survive a brief disconnect/reconnect, and see a clear result.

---

## Phase 7 — Architecture & Decisions  🧑 HITL

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 7.1 | Choose transport: raw `ws` vs. Socket.IO | 🧑 HITL | I'll recommend; you pick. |
| 7.2 | Choose server hosting (Fly.io / Railway / Render / VPS) | 🧑 HITL | Affects deploy + cost. |
| 7.3 | Decide persistence need (in-memory rooms vs. DB) | 🧑 HITL | v2 can start stateless/in-memory. |
| 7.4 | Decide auth model (anonymous + room codes vs. accounts) | 🧑 HITL | Recommend anonymous for v2. |

**Acceptance gate:** architecture decisions recorded (I'll add an `ARCHITECTURE.md` to `docs/`). 🧑

---

## Phase 8 — Shared Engine Package  🤖 AFK

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 8.1 | Extract `src/engine` into a shared module/package consumable by client + server | 🤖 AFK | Monorepo or shared dir. |
| 8.2 | Ensure engine is environment-agnostic (no DOM) | 🤖 AFK | Already designed for this in v1. |
| 8.3 | Server-side reuse of `isLegalMove`/`applyMove` for authority | 🤖 AFK | |

---

## Phase 9 — Game Server  🤝 MIXED

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 9.1 | Node WebSocket server skeleton | 🤖 AFK | |
| 9.2 | Room lifecycle: create / join-by-code / leave | 🤖 AFK | |
| 9.3 | Player pairing + seat assignment (X/O) | 🤖 AFK | |
| 9.4 | **Server-authoritative** move validation & broadcast | 🤖 AFK | Reject illegal/out-of-turn moves. |
| 9.5 | Disconnect / reconnect handling (grace window) | 🤖 AFK | |
| 9.6 | Anti-cheat basics (turn ownership, rate limits) | 🤖 AFK | |
| 9.7 | Server unit/integration tests | 🤖 AFK | |
| 9.8 | Load/edge review | 🧑 HITL | You sanity-check expected concurrency. |

---

## Phase 10 — Client Networking  🤝 MIXED

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 10.1 | Networking layer (connect, send move, apply server state) | 🤖 AFK | |
| 10.2 | Lobby UI: create/join room, share code | 🤝 MIXED | I build; you review UX. |
| 10.3 | Online turn/state sync + "waiting for opponent" states | 🤖 AFK | |
| 10.4 | Optimistic move + server reconciliation | 🤖 AFK | |
| 10.5 | Connection status / reconnect UI | 🤖 AFK | |
| 10.6 | Mode select on home screen (Local vs. Online) | 🤝 MIXED | |
| 10.7 | **Two-device live playtest** | 🧑 HITL | Real end-to-end test across devices. |

---

## Phase 11 — (Optional) AI Opponent  🤖 AFK

*Can slot into v2 or be its own milestone.* See GDD §8.

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 11.1 | Random-move AI (easy) | 🤖 AFK | |
| 11.2 | Heuristic/greedy AI (medium) | 🤖 AFK | |
| 11.3 | Minimax + alpha-beta (hard) | 🤖 AFK | Engine is search-friendly. |
| 11.4 | Difficulty selector + tuning | 🤝 MIXED | You feel-test strength. |

---

## Phase 12 — v2 Hardening & Ship  🤝 MIXED

| # | Task | Tag | Notes |
|---|------|-----|-------|
| 12.1 | Server deployment + env config | 🧑 HITL | Hosting credentials. |
| 12.2 | Client points at prod server; CORS/WSS/TLS | 🤖 AFK | |
| 12.3 | Monitoring/logging basics | 🤖 AFK | |
| 12.4 | Security review (input validation, DoS basics) | 🤝 MIXED | |
| 12.5 | **Final cross-device acceptance** | 🧑 HITL | Sign-off that v2 is done. |

---

## v3 — Stretch (parking lot)

Match history & stats, ranking/ELO, replays, shareable game codes, async/correspondence matches, accounts. Out of scope until v2 ships.

---

## How we'll work the AFK/HITL split

- **AFK runs:** I'll batch autonomous tasks (especially Phases 0–2, 8, most of 9) and report back with results for you to review — you don't need to babysit.
- **HITL checkpoints:** concentrated at decisions (0.6–0.7, Phase 7), taste (Phase 3, fonts/colors), physical-device feel (4.5, 10.7), and anything needing your credentials (deploys).
- Each phase's **acceptance gate** is an explicit 🧑 stop where you approve before I proceed.
