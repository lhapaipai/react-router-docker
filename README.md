# React Router Docker

Modèle de base pour construire une image Docker d'une application React Router avec
tout son écosystème.

Fonctionnalités:

- Application Node.js inclue dans un workspace PNPM 
- le workspace contient un paquet qui est un git submodule
- Dockerfile multistage optimisé pour réduire la taille des images (pnpm 10.5+)
  - pnpm fetch
  - pnpm deploy
- base de données PostgreSQL
- gestion des migrations prisma dans le docker compose
- GitHub Action pour construire et envoyer sur un gestionnaire de conteneur privé l'image de l'application
- Labels Traefik dans le docker compose pour une configuration automatique du Reverse Proxy.

# Connexion github -> docker hub

- sur GitHub

settings > Secrets and variables > Action

création d'une variable pour le dépôt

DOCKER_USERNAME
lhapaipai

- sur Docker Hub

création d'un PAT sur docker hub pour pouvoir pousser depuis
GitHub

https://app.docker.com/settings/personal-access-tokens/

nom: docker-tutorial
secret

- de retour sur github

création d'un secret pour le dépôt

DOCKERHUB_TOKEN
secret

# Connexion Scaleway

```bash
echo <SCW_SECRET_KEY> | docker login rg.fr-par.scw.cloud/<NAMESPACE> -u nologin --password-stdin
```