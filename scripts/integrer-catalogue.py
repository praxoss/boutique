#!/usr/bin/env python3
"""Integre un catalogue exporte depuis le backoffice dans la boutique.

    python3 scripts/integrer-catalogue.py ~/Downloads/catalogue.json
    python3 scripts/integrer-catalogue.py export.json --dest /var/www/boutique/data

Par defaut le resultat va dans boutique/ du depot. Avec --dest, il va dans
ce dossier (catalogue.json + assets/) : c'est ce que fait le bouton Publier
du backoffice sur le serveur. Les images deja publiees dans le depot
(boutique/assets/) restent valables dans les deux cas.

Les images restees en data URL dans l'export (photos chargees dans le
backoffice) sont ecrites dans boutique/assets/<nom>-<empreinte>.jpg, puis le
catalogue nettoye remplace boutique/catalogue.json. L'empreinte change avec
l'image : une photo remplacee a une nouvelle URL, les navigateurs ne
ressortent pas l'ancienne de leur cache. Les images generees ainsi et qui ne
servent plus sont supprimees.
"""
import base64
import hashlib
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO_SHOP = os.path.join(ROOT, "boutique")
DEST = REPO_SHOP
ASSETS = os.path.join(DEST, "assets")
EXT = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}


def extract(url, name, written):
    """Ecrit une data URL en fichier et renvoie son chemin relatif a la boutique."""
    if not isinstance(url, str) or not url.startswith("data:"):
        return url
    head, data = url.split(",", 1)
    mime = head[5:].split(";")[0]
    raw = base64.b64decode(data)
    path = "assets/%s-%s%s" % (name, hashlib.sha1(raw).hexdigest()[:8], EXT.get(mime, ".jpg"))
    if path not in written:
        with open(os.path.join(DEST, path), "wb") as f:
            f.write(raw)
        written.append(path)
    return path


def main(src):
    with open(src, encoding="utf8") as f:
        cat = json.load(f)
    os.makedirs(ASSETS, exist_ok=True)
    written = []

    for s in cat.get("skus", []):
        photos = s.get("photos") or []
        s["photos"] = [extract(u, s["id"], written) for u in photos] or None
        # la photo principale est la premiere de la galerie : meme fichier
        s["photo"] = s["photos"][0] if photos and s.get("photo") == photos[0] \
            else extract(s.get("photo"), s["id"], written)
        s["heroImage"] = extract(s.get("heroImage"), s["id"] + "-hero", written)
        for k in [k for k, v in s.items() if v is None]:
            del s[k]

    home = cat.get("home") or {}
    for i, c in enumerate(home.get("cats") or []):
        c["image"] = extract(c.get("image"), "accueil-univers-%d" % (i + 1), written)
    for i, d in enumerate(home.get("duo") or []):
        d["image"] = extract(d.get("image"), "accueil-bloc-%d" % (i + 1), written)
    hero = home.get("hero")
    if hero:
        sku = next((s for s in cat["skus"] if s["id"] == hero.get("id")), None)
        hero["image"] = (sku and (sku.get("heroImage") or sku.get("photo"))) \
            or extract(hero.get("image"), "accueil-hero", written)

    tmp = os.path.join(DEST, "catalogue.json.tmp")
    with open(tmp, "w", encoding="utf8") as f:
        json.dump(cat, f, ensure_ascii=False, indent=2)
        f.write("\n")
    os.replace(tmp, os.path.join(DEST, "catalogue.json"))   # jamais de catalogue a moitie ecrit

    # menage : images generees par ce script que le catalogue n'utilise plus
    text = json.dumps(cat)
    generated = re.compile(r"^.+-[0-9a-f]{8}\.(jpg|png|webp)$")
    # (pas de menage hors du depot : l'historique des publications garde
    # des catalogues qui pointent encore sur ces images)
    removed = [n for n in sorted(os.listdir(ASSETS))
               if DEST == REPO_SHOP and generated.match(n) and ("assets/" + n) not in text]
    for n in removed:
        os.remove(os.path.join(ASSETS, n))

    print("%d articles, %d image(s) extraite(s), %d supprimee(s)"
          % (len(cat.get("skus", [])), len(written), len(removed)))
    for p in written:
        print("  " + os.path.join(DEST, p))
    def exists(path):
        return any(os.path.exists(os.path.join(d, path)) for d in (DEST, REPO_SHOP))
    missing = [s["id"] for s in cat["skus"] if s.get("photo") and not exists(s["photo"])]
    if missing:
        print("ATTENTION, photo introuvable pour : " + ", ".join(missing))
        sys.exit(1)


if __name__ == "__main__":
    args = sys.argv[1:]
    if "--dest" in args:
        i = args.index("--dest")
        DEST = os.path.abspath(args[i + 1])
        ASSETS = os.path.join(DEST, "assets")
        del args[i:i + 2]
    main(args[0])
