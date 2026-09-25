// API de la boutique (boutique.implacables.fr/api/), derriere nginx, sur
// 127.0.0.1 uniquement.
//
// Publiques (la boutique) :
//   POST /api/commande          panier + coordonnees -> commande enregistree,
//                               puis page de paiement Stripe si configure
//   POST /api/stripe-webhook    Stripe confirme (ou non) le paiement
// Backoffice (nginx exige l'identifiant avant de transmettre) :
//   POST /api/publier           catalogue exporte par le backoffice
//   GET  /api/commandes         commandes enregistrees
//   POST /api/sheet-sync        renvoie toutes les commandes au Google Sheet
//   GET  /api/sante
//
// Donnees dans DATA (hors depot) : catalogue.json + assets/ + historique/
// (publications) et commandes.json.
//
// Stripe : cles lues dans l'environnement (EnvironmentFile du service,
// /etc/boutique/stripe.env), jamais dans le depot :
//   STRIPE_SECRET_KEY       cle secrete ou restreinte (sk_... / rk_...)
//   STRIPE_WEBHOOK_SECRET   secret de signature du webhook (whsec_...)
// Sans cle, les commandes sont enregistrees "a regler au retrait".
//
// Google Sheet (facultatif, /etc/boutique/sheets.env) : copie de chaque
// commande, a chaque changement, vers le script google-apps-script/Code.gs.
//   SHEETS_URL     URL de l'application Web Apps Script (.../exec)
//   SHEETS_TOKEN   jeton partage, identique a la propriete TOKEN du script
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFile } = require("child_process");

const PORT = 3100;
const DATA = process.env.BOUTIQUE_DATA || "/var/www/boutique/data";
const SITE = process.env.BOUTIQUE_URL || "https://boutique.implacables.fr";
const SCRIPT = path.join(__dirname, "..", "scripts", "integrer-catalogue.py");
const ORDERS = path.join(DATA, "commandes.json");
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WHSEC = process.env.STRIPE_WEBHOOK_SECRET || "";
const SHEETS_URL = process.env.SHEETS_URL || "";
const SHEETS_TOKEN = process.env.SHEETS_TOKEN || "";
const MAX_CATALOGUE = 40 * 1024 * 1024;
const MAX_SMALL = 256 * 1024;

function send(res, code, obj){
  res.writeHead(code, { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" });
  res.end(JSON.stringify(obj));
}
function stamp(){ return new Date().toISOString().replace(/[:.]/g, "-"); }

function readBody(req, max, cb){
  let size = 0; const chunks = []; let over = false;
  req.on("data", c => {
    size += c.length;
    if(size > max){ over = true; req.destroy(); return; }
    chunks.push(c);
  });
  req.on("end", () => cb(over ? null : Buffer.concat(chunks)));
}

function writeJsonAtomic(file, obj){
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2) + "\n");
  fs.renameSync(tmp, file);
}

/* ---------------- publication du catalogue ---------------- */
let publishing = false;

function publish(body, user, res){
  let cat;
  try { cat = JSON.parse(body); } catch(e){ return send(res, 400, { ok:false, erreur:"JSON invalide" }); }
  if(!cat || !Array.isArray(cat.skus) || !cat.skus.length || typeof cat.home !== "object"){
    return send(res, 400, { ok:false, erreur:"Catalogue incomplet (skus, home)" });
  }
  if(publishing) return send(res, 409, { ok:false, erreur:"Une publication est deja en cours, reessaie dans un instant" });
  publishing = true;

  fs.mkdirSync(path.join(DATA, "historique"), { recursive:true });
  const tmp = path.join(DATA, "historique", ".envoi-" + stamp() + ".json");
  fs.writeFileSync(tmp, body);
  execFile("python3", [SCRIPT, tmp, "--dest", DATA], { timeout:60000 }, (err, stdout, stderr) => {
    fs.rmSync(tmp, { force:true });
    publishing = false;
    if(err){
      console.error("publication refusee :", stderr || err.message, stdout);
      return send(res, 500, { ok:false, erreur:(stdout + stderr).trim().split("\n").pop() || "Echec de l'integration" });
    }
    fs.copyFileSync(path.join(DATA, "catalogue.json"), path.join(DATA, "historique", "catalogue-" + stamp() + ".json"));
    console.log("publie par", user, ":", stdout.trim().split("\n")[0]);
    send(res, 200, { ok:true, articles:cat.skus.length, detail:stdout.trim().split("\n")[0] });
  });
}

/* ---------------- commandes ---------------- */
function loadOrders(){
  try { return JSON.parse(fs.readFileSync(ORDERS, "utf8")); } catch(e){ return []; }
}
function saveOrders(list){ writeJsonAtomic(ORDERS, list); }
function updateOrder(id, patch){
  const list = loadOrders();
  const o = list.find(x => x.id === id);
  if(!o) return null;
  const before = o.statut;
  Object.assign(o, patch);
  saveOrders(list);
  if(o.statut !== before) pushToSheet([o]);   // le Sheet n'affiche que le statut
  return o;
}

/* Copie vers le Google Sheet. Jamais bloquant pour la commande. Les envois
   partent un par un (deux envois simultanes pour la meme commande faisaient
   echouer Apps Script) et sont retentes deux fois ; en dernier recours,
   "Renvoyer toutes les commandes" (backoffice) rattrape tout. */
let sheetQueue = Promise.resolve();

function sendToSheet(orders){
  return fetch(SHEETS_URL, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ token:SHEETS_TOKEN, commandes:orders }),
    redirect:"follow"
  }).then(r => r.text().then(txt => {
    let j; try { j = JSON.parse(txt); } catch(e){ j = { ok:false, erreur:"reponse " + r.status }; }
    if(!j.ok) throw new Error(j.erreur || "refus");
    return j;
  }));
}

function pushToSheet(orders){
  if(!SHEETS_URL || !SHEETS_TOKEN || !orders.length) return Promise.resolve({ ok:false, erreur:"Google Sheet non configure" });
  const ids = orders.map(o => o.id).join(", ");
  const attempt = n => sendToSheet(orders).catch(err => {
    if(n >= 3) throw err;
    console.error("Google Sheet : " + err.message + ", nouvel essai (" + ids + ")");
    return new Promise(res => setTimeout(res, 4000 * n)).then(() => attempt(n + 1));
  });
  const run = sheetQueue.then(() => attempt(1)).catch(err => {
    console.error("Google Sheet : abandon apres 3 essais :", err.message, "(" + ids + ")");
    return { ok:false, erreur:err.message };
  });
  sheetQueue = run;
  return run;
}

function newOrderId(){
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return "CMD-" + d + "-" + crypto.randomBytes(3).toString("hex").toUpperCase();
}

/* Les prix viennent du catalogue publie, jamais du navigateur. */
function priceCart(lignes){
  const cat = JSON.parse(fs.readFileSync(path.join(DATA, "catalogue.json"), "utf8"));
  const byId = {};
  cat.skus.forEach(s => { byId[s.id] = s; });
  if(!Array.isArray(lignes) || !lignes.length || lignes.length > 30) throw new Error("Panier vide ou invalide");
  return lignes.map(l => {
    const s = byId[l && l.id];
    if(!s || s.status === "discontinue") throw new Error("Article introuvable : " + (l && l.id));
    if(s.status === "rupture") throw new Error(s.name + " est en rupture de stock");
    if((s.sizes || []).indexOf(l.taille) === -1) throw new Error("Taille indisponible pour " + s.name);
    const couleur = (s.colors || []).find(c => c.n === l.couleur) || (s.colors || [])[0];
    const q = parseInt(l.quantite, 10);
    if(!(q >= 1 && q <= 20)) throw new Error("Quantite invalide pour " + s.name);
    return { id:s.id, article:s.name, couleur:couleur ? couleur.n : "", taille:l.taille, prix:s.price, quantite:q };
  });
}

function clean(s, max){ return String(s == null ? "" : s).trim().slice(0, max); }

function stripeCheckout(order){
  const p = new URLSearchParams();
  p.append("mode", "payment");
  p.append("locale", "fr");
  p.append("customer_email", order.client.email);
  p.append("client_reference_id", order.id);
  p.append("metadata[commande]", order.id);
  p.append("payment_intent_data[description]", "Boutique Implacables " + order.id);
  p.append("payment_intent_data[metadata][commande]", order.id);
  p.append("success_url", SITE + "/#/merci/" + order.id);
  p.append("cancel_url", SITE + "/#/paiement-annule");
  p.append("expires_at", String(Math.floor(Date.now() / 1000) + 3600));
  order.lignes.forEach((l, i) => {
    p.append("line_items[" + i + "][quantity]", String(l.quantite));
    p.append("line_items[" + i + "][price_data][currency]", "eur");
    p.append("line_items[" + i + "][price_data][unit_amount]", String(Math.round(l.prix * 100)));
    p.append("line_items[" + i + "][price_data][product_data][name]", l.article);
    p.append("line_items[" + i + "][price_data][product_data][description]",
      "Taille " + l.taille + (l.couleur ? " · " + l.couleur : ""));
  });
  return fetch("https://api.stripe.com/v1/checkout/sessions", {
    method:"POST",
    headers:{
      "Authorization":"Bearer " + STRIPE_KEY,
      "Content-Type":"application/x-www-form-urlencoded",
      "Idempotency-Key":order.id
    },
    body:p.toString()
  }).then(r => r.json().then(j => {
    if(!r.ok) throw new Error((j.error && j.error.message) || ("Stripe " + r.status));
    return j;
  }));
}

function createOrder(body, res){
  let req;
  try { req = JSON.parse(body); } catch(e){ return send(res, 400, { ok:false, erreur:"Requete invalide" }); }
  const client = {
    nom:clean(req.client && req.client.nom, 120),
    telephone:clean(req.client && req.client.telephone, 40),
    email:clean(req.client && req.client.email, 160)
  };
  if(!client.nom || !client.telephone || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(client.email)){
    return send(res, 400, { ok:false, erreur:"Nom, telephone et e-mail valide sont necessaires" });
  }
  let lignes;
  try { lignes = priceCart(req.lignes); } catch(e){ return send(res, 400, { ok:false, erreur:e.message }); }

  const order = {
    id:newOrderId(),
    date:new Date().toISOString(),
    client:client,
    lignes:lignes,
    total:Math.round(lignes.reduce((n, l) => n + l.prix * l.quantite, 0) * 100) / 100,
    retrait:"club house",
    statut:STRIPE_KEY ? "attente_paiement" : "a_regler"
  };
  const list = loadOrders(); list.push(order); saveOrders(list);
  console.log("commande", order.id, order.total, "EUR", order.statut);
  pushToSheet([order]);

  if(!STRIPE_KEY) return send(res, 200, { ok:true, id:order.id, sansPaiement:true });
  stripeCheckout(order)
    .then(session => {
      updateOrder(order.id, { stripe:{ session:session.id } });
      send(res, 200, { ok:true, id:order.id, url:session.url });
    })
    .catch(err => {
      console.error("Stripe :", err.message);
      updateOrder(order.id, { statut:"erreur_paiement", erreur:err.message });
      send(res, 502, { ok:false, erreur:"Le paiement en ligne est indisponible pour le moment, reessaie plus tard" });
    });
}

/* Signature Stripe : en-tete "t=<ts>,v1=<hmac>", HMAC-SHA256 de "<ts>.<corps>". */
function stripeSignatureOk(raw, header){
  if(!STRIPE_WHSEC || !header) return false;
  const parts = {};
  header.split(",").forEach(kv => {
    const i = kv.indexOf("=");
    const k = kv.slice(0, i), v = kv.slice(i + 1);
    (parts[k] = parts[k] || []).push(v);
  });
  const t = parts.t && parts.t[0];
  if(!t || Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = crypto.createHmac("sha256", STRIPE_WHSEC).update(t + "." + raw.toString("utf8")).digest();
  return (parts.v1 || []).some(v => {
    const got = Buffer.from(v, "hex");
    return got.length === expected.length && crypto.timingSafeEqual(got, expected);
  });
}

function stripeWebhook(raw, req, res){
  if(!stripeSignatureOk(raw, req.headers["stripe-signature"])) return send(res, 400, { ok:false, erreur:"Signature invalide" });
  let ev;
  try { ev = JSON.parse(raw.toString("utf8")); } catch(e){ return send(res, 400, { ok:false }); }
  const s = ev.data && ev.data.object || {};
  const id = s.client_reference_id || (s.metadata && s.metadata.commande);
  if(id){
    if((ev.type === "checkout.session.completed" && s.payment_status === "paid") ||
        ev.type === "checkout.session.async_payment_succeeded"){
      updateOrder(id, { statut:"payee", payeeLe:new Date().toISOString(),
        stripe:{ session:s.id, paiement:s.payment_intent, montant:(s.amount_total || 0) / 100 } });
      console.log("paiement recu", id);
    } else if(ev.type === "checkout.session.expired" || ev.type === "checkout.session.async_payment_failed"){
      const o = loadOrders().find(x => x.id === id);
      if(o && o.statut === "attente_paiement") updateOrder(id, { statut:"expiree" });
    }
  }
  send(res, 200, { ok:true });
}

/* ---------------- routage ---------------- */
http.createServer((req, res) => {
  const user = req.headers["x-remote-user"] || "";
  const url = req.url.split("?")[0];

  if(req.method === "GET" && url === "/api/sante") return send(res, 200, { ok:true, stripe:!!STRIPE_KEY });
  if(req.method === "GET" && url === "/api/commandes"){
    return send(res, 200, { ok:true, stripe:!!STRIPE_KEY, webhook:!!STRIPE_WHSEC, sheets:!!(SHEETS_URL && SHEETS_TOKEN), commandes:loadOrders() });
  }
  if(req.method === "POST" && url === "/api/sheet-sync"){
    return pushToSheet(loadOrders()).then(r => send(res, r.ok ? 200 : 502, r));
  }
  if(req.method !== "POST") return send(res, 404, { ok:false, erreur:"Inconnu" });

  if(url === "/api/publier"){
    return readBody(req, MAX_CATALOGUE, b => b ? publish(b.toString("utf8"), user || "?", res)
                                               : send(res, 413, { ok:false, erreur:"Catalogue trop lourd" }));
  }
  if(url === "/api/commande"){
    return readBody(req, MAX_SMALL, b => b ? createOrder(b.toString("utf8"), res)
                                           : send(res, 413, { ok:false, erreur:"Requete trop lourde" }));
  }
  if(url === "/api/stripe-webhook"){
    return readBody(req, MAX_SMALL, b => b ? stripeWebhook(b, req, res) : send(res, 413, { ok:false }));
  }
  send(res, 404, { ok:false, erreur:"Inconnu" });
}).listen(PORT, "127.0.0.1", () => {
  console.log("API boutique sur 127.0.0.1:" + PORT + ", donnees dans " + DATA +
    ", Stripe " + (STRIPE_KEY ? (STRIPE_KEY.indexOf("_test_") > -1 ? "TEST" : "LIVE") : "non configure") +
    (STRIPE_KEY && !STRIPE_WHSEC ? " (webhook non configure : les paiements ne seront pas confirmes)" : "") +
    ", Google Sheet " + (SHEETS_URL && SHEETS_TOKEN ? "branche" : "non configure"));
});
