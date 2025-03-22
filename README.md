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

## Pré-requis avant le premier déploiement

Préparation des variables d'environnement

```bash
# Avant d'effectuer le premier déploiement
# pour créer les fichiers d'environnement qui sont ignorés par git.
./bin/prepare-deployment.sh

# vous aurez besoin de créer un mot de passe pour l'administrateur du VPS
# copier la valeur générée dans ./ansible/host_vars/millau/vault.yaml
# pour la clé vault_admin_password
mkpasswd -m yescrypt

# renseigner les secrets ./deployments/app/secrets
# attention ne pas utiliser de caractère de fin de ligne à la fin du fichier
```

### Installation du VPS

Prérequis sur un nouveau serveur avant de lancer le playbook

ajouter votre clé publique dans `~/.ssh/authorized_keys` et `/root/.ssh/authorized_keys`.

Ansible se connectera donc en tant que root sans mot de passe avec notre clé privée.

Choisir un nom de domaine pour le VPS `millau.pentatrion.com` et associer son IP au nom de domaine chez l'hébergeur.

On appelera `bob` l'utilisateur administrateur sur le VPS

```bash
# copier votre clé publique sur la nouvelle instance
ssh-copy-id -i ~/.ssh/your-pub-key.pub bob@xxx.xxx.xxx.xxx

# on peut maintenant se connecter en tant que bob
ssh bob@xxx.xxx.xxx.xxx

# copier votre clé publique vers root
sudo su
cat .ssh/authorized_keys >> /root/.ssh/authorized_keys
```

Si besoin mettre à jour le fichier `./ansible/host_vars/millau/vars.yaml` et `./ansible/hosts`

Lancer le playbook ansible

```bash
cd ansible

ansible-playbook setup.yaml

# si l'on souhaite n'installer que certaines recettes
ansible-playbook setup.yaml --tags common,user-env
```

Pour faciliter les connexions futures au VPS, créer un alias sur votre ordinateur local

```bash
# ~/.ssh/config
Host millau
  HostName <server-ip-hostname>
  Port 22
  User bob
```

Pour protéger vos données sensibles vous pouvez rechiffrer votre fichier `vault.yaml`

```bash
ansible-vault encrypt host_vars/millau/vault.yaml
ansible-vault decrypt host_vars/millau/vault.yaml
```

### Installation de Traefik sur le VPS

```bash
./bin/deploy-traefik.sh
```

### Création d'une paire de clé d'accès API vers le Container Registry de Scaleway

Pour pouvoir effectuer un déploiement,
- GitHub doit pouvoir pousser les images Docker générées vers le Docker Registry de Scaleway
- Le VPS doit pouvoir tirer les images Docker du Registry Scaleway 

Se connecter dans l'interface d'aniministration de Scaleway

On va créer une identité et des accès (IAM : Identity Access Management).
Cette identité ne sera pas de type utilisateur mais application.

En haut à droite : Organisation : Pentatrion > IAM > Onglet Applications > Créer une application

Nom   : `rr-user`

Onglet : Groupes & Policies > Attachez une policy > Créer une nouvelle policy
Nom                       : Container Registry
Sélectionnez un principal : `rr-user`
Sets de permissions       : `ContainerRegistryFullAccess`

Nous avons maintenant un utilisateur avec les droits nécessaires, nous devons maintenant
associer une paire de clé API à cet utilisateur :

Clés API > Générer une clé API

porteur de la clé API : `rr-user`
expiration            : 1 mois

cela nous donne notre clé publique `SCW_ACCESS_KEY` et privée `SCW_SECRET_KEY` pour nous connecter en tant qu'utilisateur `rr-user`.

Créons maintenant un espace de nom pour notre **Container registry** (`pentatrion`).

```bash
SCW_ACCESS_KEY=xxx
SCW_SECRET_KEY=yyy
DOCKER_NAMESPACE=pentatrion
```

Nous pourrons désormais pousser des images sur le registry de Scaleway avec cette dénomination: `rg.fr-par.scw.cloud/pentatrion/<image-name>:<tag>`.

Afin de vérifier en local notre connexion
Important l'utilisateur pour se connecter au registry n'est pas `SCW_ACCESS_KEY` mais
la valeur que vous voulez (ici `nologin`) Le mot de passe est la valeur de `SCW_SECRET_KEY`
```bash
docker login rg.fr-par.scw.cloud/pentatrion -u nologin
```

### Donner à GitHub un accès au Registry de Scaleway

- sur GitHub

settings > Secrets and variables > Action

Création d'une variable pour le dépôt : New repository variable

Name
`DOCKER_NAMESPACE`

Value
`pentatrion`

Création d'un secret pour le dépôt : New repository secret

Name
`SCW_SECRET_KEY`

Value
`<your-secret>`


### Donner au VPS un accès au Registry de Scaleway

```bash
# se connecter au vps
ssh <alias-du-vps>

# initier une connexion
docker login rg.fr-par.scw.cloud/pentatrion -u nologin
```
les credentials sont alors stockés dans : `/home/<user>/.docker/config.json`.

## Déploiement

```bash
# pour le premier déploiement
./bin/deploy-app.sh --full

# pour le prochain déploiement, seul le service front est mis à jour
./bin/deploy-app.sh
```

# Certificats pour le https en local

Si l'on souhaite tester Traefik en local avec https on utilisera mkcert pour générer
des certificats auto-signés.

```bash
mkdir -p services/traefik/certs
cd services/traefik/certs

mkcert *.docker.localhost
```

