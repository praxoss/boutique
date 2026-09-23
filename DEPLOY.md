# Deploiement automatique (GitHub Actions -> Hetzner)

Chaque push sur `main` deploie automatiquement `boutique/` et `backoffice/` sur
le serveur Hetzner via SSH (`.github/workflows/deploy.yml`). Plus besoin de
taper quoi que ce soit dans un terminal apres le reglage initial ci-dessous.

## Reglage initial (une seule fois, ~5 minutes)

### 1. Generer une cle SSH dediee au deploiement

Sur ta machine (ou dans un terminal quelconque) :

```bash
ssh-keygen -t ed25519 -f deploy_key -N "" -C "github-actions-deploy"
```

Ca cree deux fichiers : `deploy_key` (privee) et `deploy_key.pub` (publique).
Ne commite jamais `deploy_key` nulle part.

### 2. Autoriser cette cle sur le serveur Hetzner

Copie la cle publique sur le serveur (remplace `user` et `host`) :

```bash
ssh-copy-id -i deploy_key.pub user@host
```

Ou manuellement : colle le contenu de `deploy_key.pub` a la fin de
`~/.ssh/authorized_keys` sur le serveur, pour l'utilisateur qui a le droit
d'ecrire dans le dossier de deploiement.

Recommande : un utilisateur dedie (ex. `deploy`) avec les droits d'ecriture
uniquement sur le dossier servi par Nginx, plutot que `root`.

### 3. Verifier / creer le dossier de destination sur le serveur

```bash
ssh user@host "mkdir -p /chemin/vers/implacables-boutique/boutique /chemin/vers/implacables-boutique/backoffice"
```

Ce chemin de base (`/chemin/vers/implacables-boutique`) est celui que Nginx
doit pointer pour `boutique.implacables.fr` (sous-dossier `boutique/`) et pour
le backoffice (sous-dossier `backoffice/`, sur le sous-domaine de ton choix).
Si ce n'est pas encore configure dans Nginx, il faut le faire une fois avant
le premier deploiement.

### 4. Ajouter les secrets dans GitHub

Sur `github.com/praxoss/boutique` -> **Settings > Secrets and variables >
Actions > New repository secret**, ajoute ces 4 secrets :

| Nom | Valeur |
|---|---|
| `HETZNER_SSH_KEY` | Contenu complet de `deploy_key` (la cle **privee**) |
| `HETZNER_HOST` | IP ou nom d'hote du serveur Hetzner |
| `HETZNER_USER` | Utilisateur SSH (ex. `deploy`) |
| `HETZNER_DEPLOY_PATH` | Chemin de base sur le serveur (ex. `/var/www/implacables-boutique`) |

### 5. Supprimer la cle privee en local

Une fois `HETZNER_SSH_KEY` colle dans GitHub, supprime `deploy_key` et
`deploy_key.pub` de ta machine (ou garde-les dans un gestionnaire de mots de
passe si tu veux pouvoir la regenerer/verifier plus tard) :

```bash
rm deploy_key deploy_key.pub
```

## Apres ca

A chaque `git push` sur `main`, l'Action GitHub Actions se declenche toute
seule, se connecte au serveur avec cette cle, et synchronise `boutique/` et
`backoffice/` (avec `rsync --delete`, donc les fichiers supprimes du repo
sont aussi supprimes du serveur). Tu peux suivre l'execution dans l'onglet
**Actions** du repo GitHub.

Pour declencher un deploiement sans nouveau commit, l'onglet Actions propose
aussi un bouton "Run workflow" (grace a `workflow_dispatch` dans le fichier).

## Limites a connaitre

- La cle SSH dediee doit rester valide : si tu la revokes ou changes
  d'utilisateur sur le serveur, le deploiement casse jusqu'a mise a jour du
  secret `HETZNER_SSH_KEY`.
- `rsync --delete` synchronise exactement le contenu du repo : un fichier
  ajoute a la main sur le serveur (hors repo) sera supprime au prochain
  deploiement.
