# Copier les commandes dans un Google Sheet

Le serveur de la boutique (`server/api.js`) envoie chaque commande au Google
Sheet du club, puis la met a jour a chaque changement de statut (payee,
paiement abandonne...). Le Sheet est une copie pratique pour l'equipe ; la
reference reste l'onglet Commandes du backoffice.

Deux onglets sont crees tout seuls au premier envoi :

- **Commandes** : une ligne par commande (client, articles, total, statut).
- **Articles** : une ligne par article commande, pour preparer le reassort.

Cinq minutes de clics cote Google, a faire avec le compte Google du club
(le Sheet lui appartiendra).

## 1. Creer le Sheet et coller le script

1. [sheets.google.com](https://sheets.google.com) : nouvelle feuille, par
   exemple **Implacables — Commandes boutique**.
2. **Extensions > Apps Script**. Remplacer le contenu de `Code.gs` par celui
   de [`google-apps-script/Code.gs`](./google-apps-script/Code.gs), puis
   enregistrer (Cmd/Ctrl + S).

## 2. Deployer en application Web

1. **Deployer > Nouveau deploiement**, type **Application Web**.
2. **Executer en tant que : Moi** ; **Qui a acces : Tout le monde**.
   (Le script refuse tout envoi sans le jeton de l'etape 3.)
3. **Deployer**, puis autoriser l'acces. L'avertissement « application non
   verifiee » est normal : c'est votre propre script. **Parametres avances >
   Acceder a ...**.
4. Copier l'**URL de l'application Web** (elle finit par `/exec`).

## 3. Brancher le serveur

Dans un terminal (la commande demande l'URL, cree un jeton et l'affiche) :

```bash
ssh -t root@178.104.195.46 'read -rp "URL de l application Web (.../exec) : " U; T=$(openssl rand -hex 24); umask 077; mkdir -p /etc/boutique; printf "SHEETS_URL=%s\nSHEETS_TOKEN=%s\n" "$U" "$T" > /etc/boutique/sheets.env; systemctl restart boutique-api; echo; echo "Jeton a coller dans la propriete TOKEN du script :"; echo "$T"'
```

Puis dans Apps Script : **Parametres du projet (roue dentee) > Proprietes
du script > Ajouter** : propriete `TOKEN`, valeur = le jeton affiche.

## 4. Remplir le Sheet

Backoffice > **Commandes & reappro** > **Renvoyer toutes les commandes**.
Les commandes deja passees arrivent dans le Sheet ; les suivantes y
arriveront toutes seules.

## Si le script change

Apres avoir recolle une nouvelle version de `Code.gs` : **Deployer > Gerer
les deploiements > modifier (crayon) > Version : Nouvelle version**. L'URL
ne change pas.
