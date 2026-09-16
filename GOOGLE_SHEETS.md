# Brancher la boutique sur Google Sheets

Le site (`boutique/index.html`) et le backoffice (`backoffice/index.html`) sont des pages
statiques, sans serveur. Le "backend" est un script Google Apps Script qui tourne
directement dans un Google Sheet et expose deux routes :

- `POST` — enregistre une commande (appele depuis la fiche produit de la boutique)
- `GET` — liste les commandes (appele depuis l'onglet "Commandes & reassort" du backoffice)

Cette etape demande des clics manuels dans l'interface Google — impossible a
automatiser depuis l'exterieur, Google exige un humain pour l'autorisation.
Ca prend 5 minutes.

## 1. Creer le Google Sheet

1. Va sur [sheets.google.com](https://sheets.google.com) et cree une feuille vide.
2. Renomme-la, par exemple **"Implacables — Commandes"**.
3. Pas besoin de creer l'onglet "Commandes" toi-meme : le script le cree tout seul
   au premier appel, avec les bons en-tetes de colonnes.

## 2. Coller le script

1. Dans le Sheet : **Extensions > Apps Script**.
2. Supprime le contenu par defaut de `Code.gs`, colle le contenu de
   [`google-apps-script/Code.gs`](./google-apps-script/Code.gs) de ce repo.
3. `Ctrl/Cmd + S` pour sauvegarder.

## 3. Deployer en Web App

1. En haut a droite : **Deployer > Nouveau deploiement**.
2. Clique sur la roue dentee a cote de "Selectionner le type" > **Application Web**.
3. Configure :
   - **Executer en tant que** : Moi (ton compte)
   - **Qui a acces** : Tout le monde
4. Clique **Deployer**, puis autorise l'acces quand Google le demande (c'est ton
   propre script, sur ta propre feuille — l'avertissement "application non
   verifiee" est normal, clique "Avance" puis "Acceder a ... (non securise)").
5. Copie l'**URL de l'application Web** generee (se termine par `/exec`).

## 4. Brancher les deux pages

Colle cette URL dans la constante `ORDERS_ENDPOINT` :

- `boutique/index.html` — proche du haut du `<script>`, variable `ORDERS_ENDPOINT`
- `backoffice/index.html` — meme variable, meme endroit

```js
var ORDERS_ENDPOINT = "https://script.google.com/macros/s/AKfycb.../exec";
```

Republie les deux artefacts (ou pousse sur GitHub si c'est deploye ailleurs) une
fois les deux fichiers modifies.

## Ce que ca fait, concretement

- Sur la boutique, "Ajouter au panier" ecrit desormais une ligne dans le Sheet
  (date, client, telephone, article, reference, couleur, taille, prix, statut).
- Sur le backoffice, l'onglet "Commandes & reassort" lit ces lignes en direct
  au lieu d'afficher les commandes de demonstration, et la jauge de reassort se
  calcule sur les vraies commandes.
- Marquer une commande "Confirmee" ou changer son statut se fait directement dans
  le Sheet pour l'instant (colonne Statut) — ce sera un bouton dans le backoffice
  dans une prochaine iteration si besoin.

## Limites a connaitre

- Le script tourne sous ton compte Google personnel — si tu le desactives ou
  changes de compte, l'endpoint casse.
- Pas d'authentification sur les routes : n'importe qui avec l'URL peut lire ou
  ecrire des commandes. Suffisant pour un usage interne club, pas pour une vraie
  boutique publique a fort trafic.
- Chaque appel Apps Script a une latence de 1 a 3 secondes — normal, ce n'est pas
  un vrai serveur.
