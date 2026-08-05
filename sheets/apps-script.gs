/**
 * Fizuli Lunch Delivery — Google Sheets order sink.
 *
 * Deploy as a Web App:
 *   1. Open your target Google Sheet.
 *   2. Extensions → Apps Script.
 *   3. Paste this file into Code.gs, save.
 *   4. Deploy → New deployment → Type: Web app.
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   5. Copy the deployment URL → set as SHEETS_WEBHOOK_URL in .env.local
 *
 * Each POST creates (if needed) a tab named YYYY-MM-DD and appends a row.
 * Columns: Time | Name | Company | Order | Total (€) | Paid
 */

var HEADERS = ['Time', 'Name', 'Phone', 'Company', 'Order', 'Notes', 'Total (€)', 'Paid'];
var TZ = 'Europe/Tallinn';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var orderedAt = data.orderedAt ? new Date(data.orderedAt) : new Date();
    var dayKey = Utilities.formatDate(orderedAt, TZ, 'yyyy-MM-dd');
    var timeStr = Utilities.formatDate(orderedAt, TZ, 'HH:mm');

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(dayKey);
    if (!sheet) {
      sheet = ss.insertSheet(dayKey);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, HEADERS.length, 160);
    }

    sheet.appendRow([
      timeStr,
      data.name || '',
      data.phone || '',
      data.company || '',
      data.order || '',
      data.notes || '',
      Number(data.total) || 0,
      data.paid ? 'Paid' : 'Pending',
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, tab: dayKey })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
