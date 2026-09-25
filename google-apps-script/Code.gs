/**
 * Copie des commandes de la boutique (boutique.implacables.fr) dans ce
 * Google Sheet. A coller dans Extensions > Apps Script, puis deployer en
 * application Web : voir GOOGLE_SHEETS.md a la racine du depot.
 *
 * C'est le serveur de la boutique qui appelle ce script (server/api.js),
 * a chaque nouvelle commande et a chaque changement de statut (payee,
 * paiement abandonne...). Le Sheet n'est qu'une copie : la reference reste
 * l'onglet Commandes du backoffice.
 *
 * Corps attendu (POST, JSON) : { token, commandes: [ commande, ... ] }
 * Le jeton doit etre egal a la propriete de script TOKEN (Parametres du
 * projet > Proprietes du script).
 */

var ONGLET_COMMANDES = "Commandes";
var ONGLET_ARTICLES = "Articles";
var ENTETES_COMMANDES = ["N° commande", "Date", "Client", "Téléphone", "E-mail", "Articles", "Total (€)", "Statut", "Payée le"];
var ENTETES_ARTICLES = ["N° commande", "Date", "Client", "Article", "Taille", "Couleur", "Quantité", "Prix unitaire (€)", "Total (€)", "Statut"];

var STATUTS = {
  payee: "Payée",
  a_regler: "À régler au retrait",
  attente_paiement: "Paiement en cours",
  expiree: "Paiement abandonné",
  erreur_paiement: "Erreur de paiement"
};

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, erreur: "JSON invalide" });
  }
  var token = PropertiesService.getScriptProperties().getProperty("TOKEN");
  if (!token || body.token !== token) return json_({ ok: false, erreur: "Jeton refuse" });

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var commandes = body.commandes || [];
    commandes.forEach(ecrireCommande_);
    return json_({ ok: true, commandes: commandes.length });
  } finally {
    lock.releaseLock();
  }
}

/* Une commande deja presente est mise a jour, sinon ajoutee. */
function ecrireCommande_(c) {
  var statut = STATUTS[c.statut] || c.statut;
  var date = c.date ? new Date(c.date) : "";
  var payeeLe = c.payeeLe ? new Date(c.payeeLe) : "";
  var client = c.client || {};
  var lignes = c.lignes || [];
  var resume = lignes.map(function (l) {
    return l.article + " " + l.taille + (l.couleur ? " " + l.couleur : "") + (l.quantite > 1 ? " x" + l.quantite : "");
  }).join(", ");

  var feuille = onglet_(ONGLET_COMMANDES, ENTETES_COMMANDES);
  var ligne = [c.id, date, client.nom || "", client.telephone || "", client.email || "", resume, c.total, statut, payeeLe];
  var rang = rangs_(feuille, c.id)[0];
  if (rang) feuille.getRange(rang, 1, 1, ligne.length).setValues([ligne]);
  else feuille.appendRow(ligne);

  var articles = onglet_(ONGLET_ARTICLES, ENTETES_ARTICLES);
  var existants = rangs_(articles, c.id);
  if (existants.length) {
    existants.forEach(function (r) { articles.getRange(r, ENTETES_ARTICLES.length).setValue(statut); });
  } else {
    lignes.forEach(function (l) {
      articles.appendRow([c.id, date, client.nom || "", l.article, l.taille, l.couleur || "", l.quantite, l.prix,
        Math.round(l.prix * l.quantite * 100) / 100, statut]);
    });
  }
}

function onglet_(nom, entetes) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var f = ss.getSheetByName(nom);
  if (!f) {
    f = ss.insertSheet(nom);
    f.appendRow(entetes);
    f.setFrozenRows(1);
    f.getRange(1, 1, 1, entetes.length).setFontWeight("bold");
    f.getRange("B:B").setNumberFormat("dd/mm/yyyy hh:mm");
    if (nom === ONGLET_COMMANDES) f.getRange("I:I").setNumberFormat("dd/mm/yyyy hh:mm");
  }
  return f;
}

/* Numeros de ligne (1 = en-tete) dont la colonne A vaut id. */
function rangs_(feuille, id) {
  var n = feuille.getLastRow();
  if (n < 2) return [];
  var ids = feuille.getRange(2, 1, n - 1, 1).getValues();
  var out = [];
  for (var i = 0; i < ids.length; i++) if (ids[i][0] === id) out.push(i + 2);
  return out;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
