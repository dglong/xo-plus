# xo-plus

Advanced tic-tac-toe ("Ultimate Tic-Tac-Toe"): a 3×3 big board where every cell is itself a 3×3 tic-tac-toe board. Your move's position inside a small board sends the opponent to the matching small board. Win a small board to acquire its big-board cell; win 3 big-board cells in a row to win.

**Stack:** TypeScript + React + Vite, SCSS. Mobile-first.
**Art direction:** minimal, warm-toned, paper-y with hand-drawn pencil strokes.
**Scope:** v1 = local hot-seat; v2 = WebSocket online multiplayer.

---

## Documentation index

All project documents live in `docs/`. Keep this table in sync (see rules below).

| Document | Path | Purpose | Last updated |
|----------|------|---------|--------------|
| Docs Wiki (hub) | `docs/DOCS_WIKI.md` | Wiki-style hub tracking every document, its status, freshness, and how the docs relate. Start here. | 2026-06-04 |
| Game Design Document | `docs/GAME_DESIGN_DOCUMENT.md` | Full rules, terminology, state model, UX/art direction, scope, AI plan, test checklist. | 2026-06-04 |
| Development Plan | `docs/DEVELOPMENT_PLAN.md` | Phased v1 (local hot-seat) + v2 (online) build plan, with AFK/HITL tags per task and acceptance gates. | 2026-06-04 |
| Testing | `docs/TESTING.md` | Test strategy/layers mapped to the GDD §10 checklist and the plan's acceptance gates. | 2026-06-04 |
| Progress Tracker | `docs/PROGRESS.md` | Living, shared checklist of what's done vs not — mirrors the Development Plan's phases/tasks. Update as work lands. | 2026-06-04 |

---

## Documentation rules (always follow)

These rules govern how docs are written and tracked so we can always tell what's current.

1. **All documents go in `docs/`.** Source code and config stay at the project root / `src/`; prose/design/spec documents (`.md`) belong in `docs/`.

2. **Always index a new document.** Whenever you create a new document, immediately add a row to the *Documentation index* table above (Document name, path, one-line purpose, today's date). A document is not "done" until it's indexed here. Also add cross-links from related docs where helpful.

3. **Every document carries a date header.** Each document must include a `**Last updated:** YYYY-MM-DD` field near the top (the GDD currently uses a `**Date:**` field — treat it as the same thing).

4. **Update the date whenever a document changes.** Any time you edit a document's content, set its `Last updated` date to today's date, and update the matching `Last updated` cell in the index table above. This keeps the index an accurate freshness signal — if a doc's date is stale, its content may be out of date.

5. **Use absolute dates.** Always write real calendar dates (`2026-06-04`), never relative ones ("today", "last week").

6. **Bump the version on meaningful revisions.** Docs with a `Document status: Draft vX.Y` line should bump the version when substantively revised (minor edits = patch/minor; major rewrites = major).
