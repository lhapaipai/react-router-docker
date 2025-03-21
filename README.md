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

# certificats pour le https en local

```bash
mkdir -p traefik/certs
cd traefik/certs

mkcert *.docker.localhost
```

## self-hosted Github Action runner

```bash
# se connecter sur notre VPS en tant qu'utilisateur normal
ssh millau

mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.322.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.322.0/actions-runner-linux-x64-2.322.0.tar.gz
echo "b13b784808359f31bc79b08a191f5f83757852957dd8fe3dbfcc38202ccf5768  actions-runner-linux-x64-2.322.0.tar.gz" | shasum -a 256 -c
tar xzf ./actions-runner-linux-x64-2.322.0.tar.gz

# configuration
./config.sh --url https://github.com/lhapaipai/react-router-docker --token XXXX

# installer le runner en tant que service
sudo ./svc.sh install
# le démarrer
sudo ./svc.sh start

# vérifier son état
systemctl status actions.runner.lhapaipai-react-router-docker.millau.service