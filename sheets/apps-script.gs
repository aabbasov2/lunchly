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
 * Each POST creates (if needed) a tab named YYYY-MM-DD (delivery date, Europe/Tallinn)
 * and appends a row.
 *
 * GET returns per-meal sold quantities for a given delivery date, computed
 * from the "Items JSON" column:  ?date=YYYY-MM-DD  →  { date, sold: { [mealId]: qty } }
 */

var HEADERS = [
  'Time',
  'Name',
  'Phone',
  'Company',
  'Order',
  'Notes',
  'Total (€)',
  'Paid',
  'Items JSON',
];
var TZ = 'Europe/Tallinn';

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureHeaders(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, HEADERS.length, 160);
    return HEADERS.slice();
  }
  var existing = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var changed = false;
  for (var i = 0; i < HEADERS.length; i++) {
    if (existing[i] !== HEADERS[i]) {
      existing[i] = HEADERS[i];
      changed = true;
    }
  }
  if (changed || existing.length < HEADERS.length) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return HEADERS.slice();
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    // Prefer the delivery date for the tab (so all orders for that lunch
    // land together). Fall back to orderedAt for legacy calls.
    var tabDate = data.deliveryDate ? new Date(data.deliveryDate) : (data.orderedAt ? new Date(data.orderedAt) : new Date());
    var orderedAt = data.orderedAt ? new Date(data.orderedAt) : new Date();
    var dayKey = Utilities.formatDate(tabDate, TZ, 'yyyy-MM-dd');
    var timeStr = Utilities.formatDate(orderedAt, TZ, 'HH:mm');

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(dayKey);
    if (!sheet) {
      sheet = ss.insertSheet(dayKey);
    }
    ensureHeaders(sheet);

    var itemsJson = data.itemsJson || '';

    sheet.appendRow([
      timeStr,
      data.name || '',
      data.phone || '',
      data.company || '',
      data.order || '',
      data.notes || '',
      Number(data.total) || 0,
      data.paid ? 'Paid' : 'Pending',
      itemsJson,
    ]);

    return jsonOut({ ok: true, tab: dayKey });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    var date = (e && e.parameter && e.parameter.date) || '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return jsonOut({ ok: false, error: 'bad date' });
    }
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(date);
    if (!sheet) return jsonOut({ ok: true, date: date, sold: {} });

    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    if (lastRow < 2 || lastCol < 1) return jsonOut({ ok: true, date: date, sold: {} });

    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var itemsCol = -1;
    var paidCol = -1;
    for (var i = 0; i < headers.length; i++) {
      if (headers[i] === 'Items JSON') itemsCol = i;
      if (headers[i] === 'Paid') paidCol = i;
    }
    if (itemsCol < 0) return jsonOut({ ok: true, date: date, sold: {} });

    var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
    var sold = {};
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      // Count paid rows AND pending rows (in-flight checkouts). Skip explicit
      // cancellations if a future column marks them.
      if (paidCol >= 0) {
        var status = String(row[paidCol] || '').toLowerCase();
        if (status === 'cancelled' || status === 'refunded') continue;
      }
      var raw = row[itemsCol];
      if (!raw) continue;
      try {
        var items = JSON.parse(raw);
        if (!Array.isArray(items)) continue;
        for (var j = 0; j < items.length; j++) {
          var it = items[j];
          if (!it || !it.id) continue;
          var qty = Number(it.qty) || 0;
          sold[it.id] = (sold[it.id] || 0) + qty;
        }
      } catch (parseErr) {
        // skip malformed rows
      }
    }
    return jsonOut({ ok: true, date: date, sold: sold });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}
