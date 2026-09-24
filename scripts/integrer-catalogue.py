#!/usr/bin/env python3
"""Integre un catalogue exporte depuis le backoffice dans la boutique.

    python3 scripts/integrer-catalogue.py ~/Downloads/catalogue.json

Les images restees en data URL dans l'export (photos chargees dans le
backoffice) sont ecrites dans boutique/assets/<id>.jpg, puis le catalogue
nettoye remplace boutique/catalogue.json.
"""
import base64
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "boutique", "assets")
EXT = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}


def extract(url, name, written):
    """Ecrit une data URL en fichier et renvoie son chemin relatif a la boutique."""
    if not isinstance(url, str) or not url.startswith("data:"):
        return url
    head, data = url.split(",", 1)
    mime = head[5:].split(";")[0]
    path = "assets/" + name + EXT.get(mime, ".jpg")
    with open(os.path.join(ROOT, "boutique", path), "wb") as f:
        f.write(base64.b64decode(data))
    written.append(path)
    return path


def main(src):
    with open(src, encoding="utf8") as f:
        cat = json.load(f)
    os.makedirs(ASSETS, exist_ok=True)
    written = []

    for s in cat.get("skus", []):
        s["photo"] = extract(s.get("photo"), s["id"], written)
        s["heroImage"] = extract(s.get("heroImage"), s["id"] + "-hero", written)
        s["photos"] = [extract(u, "%s-%d" % (s["id"], i + 1), written)
                       for i, u in enumerate(s.get("photos") or [])] or None
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

    with open(os.path.join(ROOT, "boutique", "catalogue.json"), "w", encoding="utf8") as f:
        json.dump(cat, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print("%d articles, %d image(s) extraite(s)" % (len(cat.get("skus", [])), len(written)))
    for p in written:
        print("  boutique/" + p)
    missing = [s["id"] for s in cat["skus"]
               if s.get("photo") and not os.path.exists(os.path.join(ROOT, "boutique", s["photo"]))]
    if missing:
        print("ATTENTION, photo introuvable pour : " + ", ".join(missing))
        sys.exit(1)


if __name__ == "__main__":
    main(sys.argv[1])
