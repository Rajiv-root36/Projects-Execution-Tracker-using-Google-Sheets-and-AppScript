# Architecture

## Overview

┌──────────────────────┐
│  Project sheets (N)  │   Each owned by a different QA/team,
│  "Master Plan" tab   │   contains a Quick View summary table
└──────────┬───────────┘   + weekly progress tracker
           │
           │ SpreadsheetApp.openByUrl()
           ▼
┌──────────────────────┐
│   Registry / Planning │  One row per project: name, QA, sheet URL,
│   sheet                │  (optionally) start/end dates
└──────────┬───────────┘
           │
           │ syncAllProjects() — Apps Script, run manually or on a timer
           ▼
┌──────────────────────┐
│  Portfolio tab        │  One row per project: totals, % completed,
│  ModuleData tab        │  team, timeline status, dates
│  Sync_Log tab          │  module-level breakdown
└──────────┬───────────┘
           │
           │ Gemini (natural-language prompts, no code)
           ▼
┌──────────────────────┐
│  Dashboard tab         │  Card-based executive view: KPIs,
│  (Gemini-generated)    │  ongoing projects, all projects,
└──────────────────────┘  module drill-down, team/project filters

## Core tabs

| Tab | Purpose | Written by |
|---|---|---|
| `Registry` (or external `Planning` sheet) | Project name, QA name, sheet URL, dates | Manually, by whoever registers a project |
| `QA_Teams` | Maps each QA's name to their team (Pune / France / US) | Manually, maintained once per person |
| `Portfolio` | One row per project: totals, % completed, team, dates, timeline status | Auto-written by the sync script |
| `ModuleData` | One row per module per project: pass/fail/pending counts | Auto-written by the sync script |
| `Sync_Log` | Per-project sync status and timestamp, for debugging | Auto-written by the sync script |
| `Dashboard` | The manager-facing visual, built and modified via Gemini prompts | Gemini, via natural-language instructions |

## Timeline status logic

Each project is classified based on today's date versus its start/end dates:

- **Not Started** — today is before the start date
- **Ongoing** — today falls between start and end date
- **Completed** — today is past the end date, and % Completed ≥ 99.9
- **Overdue** — today is past the end date, but % Completed < 99.9

This distinguishes "finished on time" from "deadline passed but work isn't
actually done" — a case that's easy to miss if you only look at raw
completion percentage.

## Design decisions worth knowing

- **The sync is a snapshot, not live.** Timeline status and all computed
  values are only as fresh as the last time `syncAllProjects` ran (manually,
  or via a time-driven trigger). This was a deliberate simplification —
  a fully live cross-sheet system would require much heavier tooling.
- **The dashboard has no independent state.** Every card is meant to be
  derived purely from `Portfolio` / `ModuleData` on each Gemini regeneration —
  not manually edited or cached — to avoid the dashboard drifting out of
  sync with the actual data (this was a real bug encountered early on:
  deleted projects lingered as "null" cards until this was explicitly fixed).
- **QA → Team mapping is decoupled from project registration** specifically
  to avoid needing to re-type team names per project (error-prone) — it's
  set once per person instead.
