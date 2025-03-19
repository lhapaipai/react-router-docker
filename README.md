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