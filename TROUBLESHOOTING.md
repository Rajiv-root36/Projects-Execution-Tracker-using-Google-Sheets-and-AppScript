# Troubleshooting

### A project shows "Unassigned" for Team
The QA Name in Registry/Planning doesn't exactly match an entry in
`QA_Teams` (case and whitespace are normalized, but the name itself must
match). Check for typos in either sheet.

### % Completed or dates show as garbled dates (e.g. "1900-04-09")
Sheets is applying a stale date format to a column that now holds plain
numbers — usually happens after inserting a new column shifts existing
formatting. Fix by explicitly setting the column's number format after
writing data (see `setNumberFormat` calls in the sync script).

### A project shows "Overdue" but looks 100% done
Check which number you're looking at. A weekly tracker showing all test
*scripts* logged does not mean all test *cases* were executed — check the
% Completed / Pass-Fail breakdown specifically, not just the cumulative
script count.

### Timeline Status seems off by one day
Make sure date comparisons strip time-of-day before comparing (`today 
startDate` on raw Date objects can be affected by time-of-day mismatches,
even on the same calendar day).

### A deleted project still shows up as a blank/"null" card
The dashboard may have cached a manually-editable record independent of
the live sheet data. Re-prompt Gemini to regenerate all cards purely from
current `Portfolio` rows, and avoid using any per-card manual edit/delete
affordances the dashboard tool may offer.

### Sync fails for one project with a permissions error
The central sheet's owner needs at least Viewer access to that specific
project's sheet. Confirm sharing, and re-run the sync.

### Dashboard change breaks the layout
Before any significant dashboard prompt, note the current timestamp via
Version History (clock icon, top of the sheet). If a prompt-based change
doesn't cleanly revert with an opposite prompt, restore that version
directly instead.
