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

## Sur le serveur

- nginx : `/etc/nginx/sites-available/boutique`. La racine du site est
  `current/boutique/` ; `/backoffice/` et `/boutique/` (chemins relatifs
  du backoffice) pointent sur leurs dossiers. Le reste du depot (`.git`,
  `scripts/`...) n'est pas servi.
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
