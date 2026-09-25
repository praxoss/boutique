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
- **`server/api.js`** — l'API du serveur : publication du catalogue depuis
  le backoffice, enregistrement des commandes et paiement Stripe.
- **`scripts/integrer-catalogue.py`** — sort les photos d'un catalogue
  exporte en fichiers (utilise par la publication).

## Commandes et paiement

Le panier envoie la commande a l'API, qui recalcule les prix a partir du
catalogue publie, l'enregistre et renvoie le client vers la page de
paiement Stripe. Stripe confirme ensuite le paiement au serveur (webhook) ;
les commandes s'affichent dans l'onglet Commandes du backoffice. Sans cle
Stripe sur le serveur, les commandes sont enregistrees « a regler au
retrait ». Reglage : [`DEPLOY.md`](./DEPLOY.md).

## Hebergement

En ligne sur https://boutique.implacables.fr (backoffice :
https://boutique.implacables.fr/backoffice/), servi par nginx sur le serveur
Hetzner. Chaque push sur `main` y est repris automatiquement en moins d'une
minute : voir [`DEPLOY.md`](./DEPLOY.md).
