const MARIJANA_WEBHOOK_URL = "OVDE_UNESI_MARIJANA_WEBHOOK";
const CONNECTION_ID = "OVDE_UNESI_CONNECTION_ID";

function onFormSubmit(e) {
  const named = e && e.namedValues ? e.namedValues : {};
  const row = {};
  Object.keys(named).forEach(key => row[key] = Array.isArray(named[key]) ? named[key][0] : named[key]);

  UrlFetchApp.fetch(MARIJANA_WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ connection_id: CONNECTION_ID, direction: "inbound", rows: [row] }),
    muteHttpExceptions: true
  });
}

function sendActiveRow() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rowIndex = sheet.getActiveRange().getRow();
  const values = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = {};
  headers.forEach((h, i) => row[h] = values[i]);

  UrlFetchApp.fetch(MARIJANA_WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ connection_id: CONNECTION_ID, direction: "inbound", rows: [row] }),
    muteHttpExceptions: true
  });
}