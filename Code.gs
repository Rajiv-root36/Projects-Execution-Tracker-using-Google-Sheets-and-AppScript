function syncAllProjects() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const registry = ss.getSheetByName('Registry');
  const rows = registry.getDataRange().getValues();
  const today = new Date();

  const portfolioRows = [];
  const moduleRows = [];

  for (let i = 1; i < rows.length; i++) {
    const [projectName, sheetUrl, qaName] = rows[i];
    if (!projectName || !sheetUrl) continue;

    try {
      const sourceSS = SpreadsheetApp.openByUrl(sheetUrl);
      const masterTab = sourceSS.getSheetByName('Master Plan');
      if (!masterTab) {
        registry.getRange(i + 1, 4).setValue('Error: "Master Plan" tab not found');
        continue;
      }
      const data = masterTab.getDataRange().getValues();

      let totalTests = '', pctCompleted = '';
      for (let r = 0; r < data.length; r++) {
        if (String(data[r][0]).trim() === 'Total tests') {
          totalTests = data[r][1];
          pctCompleted = data[r][8];
          break;
        }
      }

      let headerRowIdx = -1;
      for (let r = 0; r < data.length; r++) {
        if (String(data[r][0]).trim() === 'Module/Component') { headerRowIdx = r; break; }
      }
      if (headerRowIdx > -1) {
        for (let r = headerRowIdx + 1; r < data.length; r++) {
          const label = data[r][0];
          if (!label || String(label).trim() === 'Total') break;
          moduleRows.push([projectName, ...data[r].slice(0, 9)]);
        }
      }

      let timelineHeaderIdx = -1;
      for (let r = 0; r < data.length; r++) {
        if (String(data[r][0]).trim().startsWith('Time [')) { timelineHeaderIdx = r; break; }
      }
      let startDate = null, endDate = null;
      if (timelineHeaderIdx > -1) {
        for (let r = timelineHeaderIdx + 1; r < data.length; r++) {
          const val = data[r][0];
          if (!val) break;
          const d = (val instanceof Date) ? val : new Date(val);
          if (isNaN(d)) continue;
          if (!startDate) {
            startDate = new Date(d);
            startDate.setDate(startDate.getDate() - 4);
          }
          endDate = d;
        }
      }

      let timelineStatus = 'Unknown';
      if (startDate && endDate) {
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        if (todayMidnight < startMidnight) timelineStatus = 'Not Started';
        else if (todayMidnight <= endMidnight) timelineStatus = 'Ongoing';
        else timelineStatus = (Number(pctCompleted) >= 99.9) ? 'Completed' : 'Overdue';
      }

      portfolioRows.push([
        projectName, qaName, totalTests, pctCompleted,
        startDate ? Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd') : '',
        endDate ? Utilities.formatDate(endDate, Session.getScriptTimeZone(), 'yyyy-MM-dd') : '',
        timelineStatus
      ]);

      registry.getRange(i + 1, 4).setValue('Synced: ' + new Date().toLocaleString());

    } catch (e) {
      registry.getRange(i + 1, 4).setValue('Error: ' + e.message);
    }
  }

  portfolioRows.sort((a, b) => new Date(b[4]) - new Date(a[4])); // most recent Start Date first

  writeSheet('Portfolio',
    ['Project', 'QA Name', 'Total Tests', '% Completed', 'Start Date', 'End Date', 'Timeline Status'],
    portfolioRows);

  const portfolioSheet = ss.getSheetByName('Portfolio');
  if (portfolioRows.length) {
    portfolioSheet.getRange(2, 3, portfolioRows.length, 1).setNumberFormat('0');
    portfolioSheet.getRange(2, 4, portfolioRows.length, 1).setNumberFormat('0.0');
    portfolioSheet.getRange(2, 5, portfolioRows.length, 2).setNumberFormat('yyyy-mm-dd');
  }

  writeSheet('ModuleData',
    ['Project', 'Module', 'Priority', 'Total', 'Pending', 'Completed', 'Pass', 'Fail', 'On Hold', 'N/A'],
    moduleRows);

  const dashboard = ss.getSheetByName('Dashboard');
  if (dashboard && portfolioRows.length) {
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(portfolioRows.map(r => r[0]), true).build();
    dashboard.getRange('B1').setDataValidation(rule);
  }
}

function writeSheet(name, headers, rows) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length) sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Projects Sync')
    .addItem('Sync All Projects Now', 'syncAllProjects')
    .addToUi();
}
