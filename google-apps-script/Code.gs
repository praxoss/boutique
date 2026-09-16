/**
 * Backend for the Implacables boutique, running inside a Google Sheet
 * (Extensions > Apps Script). Deployed as a Web App, it turns the Sheet
 * into a tiny order-logging API for boutique/index.html and backoffice/index.html.
 *
 * Setup: see ../GOOGLE_SHEETS.md
 */

var SHEET_NAME = "Commandes";
var HEADERS = ["Date", "Client", "Telephone", "Article", "Reference", "Couleur", "Taille", "Prix", "Statut"];

function getOrdersSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Called by boutique/index.html when someone validates an order on a product page.
 * Appends one row per order. Body is JSON (posted as text/plain to dodge the
 * CORS preflight Apps Script doesn't support):
 * { client, telephone, article, reference, couleur, taille, prix }
 */
function doPost(e) {
  var sheet = getOrdersSheet_();
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOutput_({ ok: false, error: "invalid JSON body" });
  }

  sheet.appendRow([
    new Date(),
    data.client || "",
    data.telephone || "",
    data.article || "",
    data.reference || "",
    data.couleur || "",
    data.taille || "",
    data.prix || "",
    "En attente"
  ]);

  return jsonOutput_({ ok: true });
}

/**
 * Called by backoffice/index.html (Commandes & reassort tab) to list every
 * order currently in the Sheet, most recent last.
 */
function doGet(e) {
  var sheet = getOrdersSheet_();
  var values = sheet.getDataRange().getValues();
  var headers = values.shift() || HEADERS;

  var rows = values
    .filter(function (row) { return row.join("") !== ""; })
    .map(function (row) {
      var obj = {};
      headers.forEach(function (h, i) {
        var v = row[i];
        obj[h] = (v instanceof Date) ? Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd") : v;
      });
      return obj;
    });

  return jsonOutput_(rows);
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
