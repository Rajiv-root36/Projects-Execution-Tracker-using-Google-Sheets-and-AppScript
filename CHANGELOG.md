# Changelog

## Working Script 1
- Initial sync engine: reads Registry, pulls each project's Master Plan
  data, writes to Portfolio and ModuleData.
- Fixed: % Completed and dates being misread as dates due to sheet
  formatting bleed-over after column insertion — now explicitly forced
  with `setNumberFormat`.
- Fixed: Timeline Status off-by-one-day bug caused by comparing full
  timestamps instead of calendar dates.

## Added: QA Name + Team
- Registry gained a `QA Name` column.
- New `QA_Teams` lookup tab maps QA name → team, avoiding the need to
  type/repeat team names per project.
- Portfolio gained `Team` column via lookup.

## Added: Timeline-based sorting
- Portfolio rows sorted by most recent Start Date first.
- Noted limitation: "Not Started" projects (future start dates) sort
  above Ongoing/Completed under pure date sort — flagged as a possible
  future change (status-priority sort instead of pure date sort).

## Dashboard iterations (via Gemini prompts)
- Initial card-based executive dashboard generated from Portfolio +
  ModuleData.
- Added Ongoing Projects and All Projects sections; removed Module
  Breakdown and side-panel insights sections per feedback.
- Rearranged layout: Ongoing Projects + All Projects side-by-side,
  scrollable; Project Health Grid moved to full-width bottom section.
- Fixed: full-width layout change caused excessive whitespace between
  cards — resolved with explicit grid density/column-count instructions.
- Fixed: dashboard showed stale "null" cards for deleted projects —
  resolved by instructing Gemini to derive all cards purely from live
  Portfolio data rather than maintaining independent per-card records.
- Added: QA name displayed next to project name on every card.
- Replaced "Overall Completed" KPI with "Active Projects" / "Upcoming
  Projects" counts.
- Replaced "All Projects" section with "Projects Completed Last Week".
- Made "Upcoming Projects" KPI clickable to reveal the underlying list.

## Planned / in progress
- Team-based filtering across all dashboard sections.
- Sourcing Start Date / End Date / Execution Sheet URL directly from an
  external, authoritative planning sheet instead of deriving dates from
  each project's weekly tracker table.
