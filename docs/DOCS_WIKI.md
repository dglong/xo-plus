# xo-plus — Docs Wiki

**Document status:** Living document
**Last updated:** 2026-06-04

The hub for all xo-plus documentation. Use the wiki-style links (`[[NAME]]`) to jump between docs. This page tracks every document, its status, and freshness so we always know what's current.

> **Wiki link convention:** `[[FILE_NAME]]` (no `.md`) points to the file of that name in `docs/`. Editors like Obsidian/Foam resolve these automatically; a standard relative link is given alongside each entry for plain Markdown viewers.

---

## Document tracker

| Document | Wiki link | Path | Status | Last updated |
|----------|-----------|------|--------|--------------|
| Game Design Document | `[[GAME_DESIGN_DOCUMENT]]` | [GAME_DESIGN_DOCUMENT.md](./GAME_DESIGN_DOCUMENT.md) | Draft v1.1 | 2026-06-04 |
| Development Plan | `[[DEVELOPMENT_PLAN]]` | [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) | Draft v1.0 | 2026-06-04 |
| Testing | `[[TESTING]]` | [TESTING.md](./TESTING.md) | Draft v1.0 | 2026-06-04 |
| Progress Tracker | `[[PROGRESS]]` | [PROGRESS.md](./PROGRESS.md) | Living | 2026-06-04 |
| Docs Wiki (this page) | `[[DOCS_WIKI]]` | [DOCS_WIKI.md](./DOCS_WIKI.md) | Living | 2026-06-04 |

---

## Document map

How the docs relate to each other:

```
                 [[DOCS_WIKI]]  ← you are here (hub)
                       │
        ┌──────────────┼───────────────┐
        ▼              ▼                ▼
[[GAME_DESIGN_     [[DEVELOPMENT_   [[TESTING]]
 DOCUMENT]]            PLAN]] ◄──────────┘
   (what to          (how/when to     (how we verify
    build)            build it)        it's correct)
        ▲                  │
        └──────────────────┘
        (plan references rules & §10 test checklist)
```

- **[[GAME_DESIGN_DOCUMENT]]** — the source of truth for *what* the game is: rules, terminology, state model, UX/art direction, scope. Everything else derives from it.
- **[[DEVELOPMENT_PLAN]]** — *how and when* we build it: phased v1/v2 breakdown with AFK/HITL tags and acceptance gates.
- **[[TESTING]]** — *how we prove it works*: test strategy mapped to the GDD §10 checklist and the plan's acceptance gates.
- **[[PROGRESS]]** — *where we are*: a living, shared checklist mirroring the plan's phases/tasks, marking done vs. not.

---

## Maintenance rules

These mirror the documentation rules in the root `CLAUDE.md` — keep both in sync.

1. **Every new document** gets a row in the *Document tracker* above **and** in `CLAUDE.md`, with a wiki link, path, status, and today's date.
2. **On any edit** to a document, bump its `Last updated` here, in `CLAUDE.md`, and in the document's own header.
3. **Use wiki links** (`[[NAME]]`) when referring to other docs in prose, so the wiki graph stays connected.
4. **Absolute dates only** (`2026-06-04`), never relative.
5. A stale `Last updated` date is a signal the content may be out of date — check it before relying on a doc.
