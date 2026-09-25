# Implacables — Boutique

Boutique en ligne du club de rugby Les Implacables, destinee a
`boutique.implacables.fr`, plus le backoffice de gestion des SKU et des
commandes.

## Contenu

- **`boutique/`** — PLP + PDP client-side (grille produits, filtres, fiche
  produit avec carrousel photo, tailles/couleurs, commande). Un seul fichier
  HTML autonome (`index.html`) + ses images dans `assets/`.
- **`backoffice/`** — gestion du catalogue SKU par typologie d'article
  (Maillots, T-shirts, Sweats, Shorts, Accessoires) et suivi des commandes /
  seuil de reassort fournisseur. Meme principe : `index.html` autonome.
- **`google-apps-script/`** — le script qui transforme un Google Sheet en API
  d'enregistrement des commandes, utilise par les deux pages ci-dessus.
- **`GOOGLE_SHEETS.md`** — comment deployer ce script et brancher les deux
  pages dessus (5 minutes, quelques clics obligatoires cote Google).

## Etat actuel

Les deux pages sont fonctionnelles en local (navigateur) : filtrage,
selection taille/couleur, creation/edition de SKU, etc. Sans Google Sheets
branche (`ORDERS_ENDPOINT` vide dans les deux fichiers), les commandes
passees sur la boutique ne sont loguees que dans la console du navigateur,
et le backoffice affiche des commandes de demonstration.

## Hebergement

En ligne sur https://boutique.implacables.fr (backoffice :
https://boutique.implacables.fr/backoffice/), servi par nginx sur le serveur
Hetzner. Chaque push sur `main` y est repris automatiquement en moins d'une
minute : voir [`DEPLOY.md`](./DEPLOY.md).
