# Portfolio Execution Tracker

A self-service, auto-refreshing Google Sheets dashboard that gives a manager
a single, live view of test execution status across multiple projects —
without anyone manually compiling status updates.

## What it does

- Each project's QA team keeps their own execution sheet (a "Master Plan" tab
  with test case counts, pass/fail status, and a weekly progress tracker).
- A central "Portfolio Command Center" sheet pulls data from every registered
  project sheet via Google Apps Script, consolidates it, and computes:
  - Total tests, % completed, and pass/fail breakdown per project
  - A **Timeline Status** per project (Not Started / Ongoing / Completed / Overdue)
    based on planned start and end dates
  - Module-level breakdowns per project
  - Team assignment (via a QA → Team lookup)
- A Gemini-generated dashboard on top presents this as a card-based,
  color-coded executive view: ongoing projects, recently completed projects,
  a full project list, and per-module drill-down — filterable by project and team.

## Why this exists

Manually asking 5+ QA leads for a status update, then compiling it into a
slide or email, doesn't scale and is always a few days stale. This system
instead treats each team's own tracking sheet as the source of truth and
assembles the summary automatically, on a schedule.

## Stack

- **Google Sheets** — data storage and source-of-truth execution sheets
- **Google Apps Script** — the sync engine (`Code.gs`, not included in this
  repo since it contains environment-specific sheet references — see
  [SETUP.md](./SETUP.md) for how to recreate it)
- **Gemini in Sheets** — dashboard generation via natural-language prompts
  (prompts documented in [SETUP.md](./SETUP.md))

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — how data flows through the system
- [SETUP.md](./SETUP.md) — step-by-step setup from a blank sheet
- [CHANGELOG.md](./CHANGELOG.md) — version history of the sync script and dashboard
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — common issues and fixes

## Status

Actively evolving — currently used for internal QA execution tracking across
multiple concurrent projects.
