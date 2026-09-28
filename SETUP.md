# Setup Guide

This walks through building the system from a blank Google Sheet.

## Prerequisites

- Every project's execution sheet must have a tab literally named
  `Master Plan`, containing:
  - A "Quick View - Test scripts" summary table with a `Total tests` row
    (Total in column B, % Completed in column I)
  - A `Module/Component` breakdown table (Priority, Total, Pending,
    Completed, Pass, Fail, On Hold, N/A columns), ending in a `Total` row
  - A weekly tracker table starting with a row labeled `Time [friday of
    week ending]`, used to derive project start/end dates if you're not
    using an external planning sheet

## 1. Create the central spreadsheet

Create a new Google Sheet — e.g. "Portfolio Command Center". This is the
only file the manager needs to open.

## 2. Add the required tabs

- `Registry` — headers: `Project Name | Sheet URL | QA Name | Status`
  (skip this if you're using an external Planning sheet instead — see
  ARCHITECTURE.md)
- `QA_Teams` — headers: `QA Name | Team`. Add a data-validation dropdown
  on the Team column restricted to your actual team names.
- `Portfolio`, `ModuleData`, `Sync_Log`, `Dashboard` — leave these blank;
  the script creates/populates them automatically.

## 3. Add the sync script

Extensions → Apps Script → paste in the sync engine (see project
maintainer for the current `Code.gs` — intentionally excluded from this
repo since it contains sheet-specific references).

Save, reload the spreadsheet, and confirm a custom menu (e.g. "Projects
Sync") appears.

## 4. Authorize and run

Run the sync function once from the custom menu. Approve the "unverified
app" permission screen — this is standard for your own scripts, not a
security issue.

## 5. Register projects

Each project owner shares their execution sheet (Viewer access) with
whoever owns this central sheet, and adds a row to `Registry` (or the
external planning sheet) with their project name, sheet URL, and QA name.

## 6. Run the sync and verify

Run the sync again. Check:
- `Sync_Log` shows "Synced" (not an error) for each project
- `Portfolio` has correct totals, % completed, team, and timeline status
- `ModuleData` has module-level rows per project

## 7. Build the dashboard

With `Portfolio` and `ModuleData` selected in Gemini's context picker,
use natural-language prompts to build and iterate on the dashboard — see
the prompt history in this project's documentation/commit messages for
the exact prompts used to build the current version.

## 8. Automate refresh (optional)

Apps Script → Triggers → Add trigger → your sync function → time-driven →
hourly (or your preferred interval).
