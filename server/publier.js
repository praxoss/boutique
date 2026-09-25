// API de publication du backoffice (boutique.implacables.fr/api/).
//
// Tourne sur le serveur Hetzner derriere nginx, qui exige l'identifiant du
// backoffice (auth_basic) avant de transmettre quoi que ce soit ici : ce
// service n'ecoute que sur 127.0.0.1.
//
//   POST /api/publier   corps : { skus, home } tel que l'exporte le backoffice
//   GET  /api/sante
//
// Le catalogue publie vit hors du depot, dans DATA (catalogue.json +
// assets/), avec une copie horodatee de chaque version dans historique/.
// Les images en data URL sont sorties en fichiers par integrer-catalogue.py.
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const PORT = 3100;
const DATA = process.env.BOUTIQUE_DATA || "/var/www/boutique/data";
const SCRIPT = path.join(__dirname, "..", "scripts", "integrer-catalogue.py");
const MAX_BODY = 40 * 1024 * 1024;

function send(res, code, obj){
  res.writeHead(code, { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" });
  res.end(JSON.stringify(obj));
}

function stamp(){ return new Date().toISOString().replace(/[:.]/g, "-"); }

let busy = false;

function publish(body, user, res){
  let cat;
  try { cat = JSON.parse(body); } catch(e){ return send(res, 400, { ok:false, erreur:"JSON invalide" }); }
  if(!cat || !Array.isArray(cat.skus) || !cat.skus.length || typeof cat.home !== "object"){
    return send(res, 400, { ok:false, erreur:"Catalogue incomplet (skus, home)" });
  }
  if(busy) return send(res, 409, { ok:false, erreur:"Une publication est deja en cours, reessaie dans un instant" });
  busy = true;

  fs.mkdirSync(path.join(DATA, "historique"), { recursive:true });
  const tmp = path.join(DATA, "historique", ".envoi-" + stamp() + ".json");
  fs.writeFileSync(tmp, body);
  execFile("python3", [SCRIPT, tmp, "--dest", DATA], { timeout:60000 }, (err, stdout, stderr) => {
    fs.rmSync(tmp, { force:true });
    busy = false;
    if(err){
      console.error("publication refusee :", stderr || err.message, stdout);
      return send(res, 500, { ok:false, erreur:(stdout + stderr).trim().split("\n").pop() || "Echec de l'integration" });
    }
    const out = path.join(DATA, "historique", "catalogue-" + stamp() + ".json");
    fs.copyFileSync(path.join(DATA, "catalogue.json"), out);
    console.log("publie par", user, ":", stdout.trim().split("\n")[0]);
    send(res, 200, { ok:true, articles:cat.skus.length, detail:stdout.trim().split("\n")[0] });
  });
}

http.createServer((req, res) => {
  const user = req.headers["x-remote-user"] || "?";
  if(req.method === "GET" && req.url === "/api/sante") return send(res, 200, { ok:true });
  if(req.method !== "POST" || req.url !== "/api/publier") return send(res, 404, { ok:false, erreur:"Inconnu" });

  let size = 0; const chunks = [];
  req.on("data", c => {
    size += c.length;
    if(size > MAX_BODY){ send(res, 413, { ok:false, erreur:"Catalogue trop lourd" }); req.destroy(); return; }
    chunks.push(c);
  });
  req.on("end", () => { if(size <= MAX_BODY) publish(Buffer.concat(chunks).toString("utf8"), user, res); });
}).listen(PORT, "127.0.0.1", () => console.log("API boutique sur 127.0.0.1:" + PORT + ", donnees dans " + DATA));
