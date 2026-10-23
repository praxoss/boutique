# Deploiement (Hetzner, boutique.implacables.fr)

La boutique est servie par nginx sur le serveur Hetzner (178.104.195.46),
a cote de ffse.implacables.fr :

- https://boutique.implacables.fr/ : la boutique (`boutique/`)
- https://boutique.implacables.fr/backoffice/ : le backoffice (`backoffice/`)

## Mise a jour : automatique

Il n'y a rien a faire apres un `git push` sur `main`. Le serveur recupere
lui-meme le depot (public) chaque minute :

- copie de travail : `/var/www/boutique/current` (utilisateur `deploy`)
- script : `/usr/local/bin/boutique-pull` (fetch + reset sur `origin/main`)
- declencheur : `boutique-pull.timer` (systemd, toutes les minutes)

Pas de cle SSH ni de secret GitHub : le serveur ne fait que lire un depot
public.

## Publication du catalogue (bouton Publier)

Le catalogue ne passe plus par le depot. Le bouton **Publier** du backoffice
envoie le catalogue (photos comprises) a une petite API sur le serveur,
`server/api.js`, qui l'integre avec `scripts/integrer-catalogue.py` dans
`/var/www/boutique/data` :

- `data/catalogue.json` : le catalogue servi a `/catalogue.json`
- `data/assets/` : les photos publiees (servies a `/assets/`, avant celles
  du depot)
- `data/historique/` : une copie horodatee de chaque publication. Pour
  revenir en arriere : `cp historique/catalogue-<date>.json catalogue.json`
  (en root, puis `chown boutique: catalogue.json`).

`boutique/catalogue.json` du depot ne sert plus que de repli si
`data/catalogue.json` manque.

## Acces au backoffice

`/backoffice/` et `/api/` demandent un identifiant (auth_basic nginx), lu
dans `/etc/nginx/boutique.htpasswd`. Ajouter un compte (le mot de passe est
demande deux fois, rien n'est affiche) :

```bash
ssh -t root@178.104.195.46 'printf "%s:%s\n" NOM "$(openssl passwd -apr1)" >> /etc/nginx/boutique.htpasswd'
```

Retirer un compte : supprimer sa ligne dans ce fichier. Aucun redemarrage
n'est necessaire.

## Paiement Stripe

Le serveur cree une session Stripe Checkout pour chaque commande
(`server/api.js`), et Stripe lui confirme le paiement par un webhook. Deux
secrets, poses sur le serveur uniquement (jamais dans le depot) dans
`/etc/boutique/stripe.env`, lu par `boutique-api.service` :

- `STRIPE_SECRET_KEY` : de preference une **cle restreinte** (`rk_...`),
  droit *Checkout Sessions : ecriture* suffit ; sinon la cle secrete
  (`sk_...`). En `_test_` pour essayer, puis la cle live.
- `STRIPE_WEBHOOK_SECRET` : le secret de signature (`whsec_...`) du webhook
  declare dans Stripe (Developpeurs > Webhooks) :
  URL `https://boutique.implacables.fr/api/stripe-webhook`, evenements
  `checkout.session.completed`, `checkout.session.expired`,
  `checkout.session.async_payment_succeeded`,
  `checkout.session.async_payment_failed`.

Poser ou changer les deux secrets (saisie masquee, rien n'est affiche) :

```bash
ssh -t root@178.104.195.46 'read -rsp "Cle Stripe (sk_... ou rk_...) : " K; echo; read -rsp "Secret du webhook (whsec_...) : " W; echo; umask 077; mkdir -p /etc/boutique; printf "STRIPE_SECRET_KEY=%s\nSTRIPE_WEBHOOK_SECRET=%s\n" "$K" "$W" > /etc/boutique/stripe.env; systemctl restart boutique-api; sleep 1; journalctl -u boutique-api -n 1 --no-pager -o cat'
```

La derniere ligne affichee dit si Stripe est en TEST ou en LIVE. Sans ce
fichier, les commandes sont enregistrees « a regler au retrait ».

Commandes enregistrees : `/var/www/boutique/data/commandes.json`. Copie
dans le Google Sheet du club si `/etc/boutique/sheets.env` existe : voir
[`GOOGLE_SHEETS.md`](./GOOGLE_SHEETS.md).

## Sur le serveur

- nginx : `/etc/nginx/sites-available/boutique`. La racine du site est
  `current/boutique/` ; `/catalogue.json` et `/assets/` passent d'abord par
  `data/` ; `/backoffice/` pointe sur son dossier ; `/boutique/...` (chemins
  relatifs du backoffice) est renvoye a la racine. Le reste du depot
  (`.git`, `scripts/`, `server/`...) n'est pas servi.
- API : `boutique-api.service` (node `server/api.js`, 127.0.0.1:3100),
  redemarree automatiquement par `boutique-api-reload.path` quand le dossier
  `server/` change. Elle tourne sous son propre compte `boutique` (pas
  `deploy`, qui fait aussi tourner le site FFSE), cloisonnee par systemd
  (`/etc/systemd/system/boutique-api.service.d/securite.conf`) : seul
  `/var/www/boutique/data` lui est accessible en ecriture. Ce dossier
  appartient a `boutique` ; `commandes.json` et `precommandes.json` sont en
  600 (donnees personnelles).
  `/api/commande` et `/api/stripe-webhook` sont publics (limites en debit
  par nginx) ; le reste de `/api/` demande l'identifiant du backoffice.
- HTTPS : certificat Let's Encrypt `boutique.implacables.fr`, pose par
  certbot et renouvele par `certbot.timer`.
- Cache : pages HTML et `catalogue.json` toujours revalides ; images en
  cache 7 jours (les photos publiees ont un nom a empreinte).

Commandes utiles :

```bash
ssh root@178.104.195.46 systemctl list-timers boutique-pull.timer
ssh root@178.104.195.46 journalctl -u boutique-pull.service -n 20
ssh root@178.104.195.46 sudo -u deploy /usr/local/bin/boutique-pull   # mise a jour immediate
```

## Securite du serveur (octobre 2026)

- SSH : cle uniquement (`/etc/ssh/sshd_config.d/00-securite.conf`), plus
  aucun mot de passe accepte.
- Pare-feu `ufw` : seuls 22 (limite), 80 et 443 sont ouverts ; les
  applications (3000 FFSE, 3100 boutique, 3200 coach) ne sont joignables
  que par nginx.
- `fail2ban` (`/etc/fail2ban/jail.d/implacables.local`) : 1 h de blocage
  apres 5 echecs en 10 min, en SSH comme sur le mot de passe du backoffice ;
  1 semaine pour les recidivistes. Debloquer une adresse :
  `fail2ban-client unban <ip>`.
- nginx : en-tetes de securite et CSP stricte (aucun script integre aux
  pages : tout le code est dans `app.js`), version masquee
  (`server_tokens off`).
- Mises a jour de securite automatiques (`unattended-upgrades`) ; quand un
  noyau en attend un, `/var/run/reboot-required` existe.
