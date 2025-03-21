## Prérequis sur un nouveau serveur qui sera piloté par Coolify avant de lancer le playbook

ajouter notre clé publique dans `~/.ssh/authorized_keys` et `/root/.ssh/authorized_keys`.

Ansible se connectera donc en tant que root sans mot de passe avec notre clé privée.

ajouter les enregistrements DNS A pour notre hôte.

```bash
# copier notre clé publique sur la nouvelle instance
ssh-copy-id -i ~/.ssh/your-pub-key.pub lhapaipai@xxx.xxx.xxx.xxx

# on peut maintenant se connecter en tant que lhapaipai
ssh lhapaipai@xxx.xxx.xxx.xxx


# copier notre clé publique vers root
sudo su
cat .ssh/authorized_keys >> /root/.ssh/authorized_keys

```

## Créer la paire de clé publique/privée pour le vps

générer type RSA (problèmes avec ed_25519)
```bash
ssh-keygen -C "millau@pentatrion.com"
```
Inscrire le contenu des clés dans le fichier `vault.yaml`
```yaml
# ./host_vars/millau/vault.yaml
vault_ssh_public_key: ssh-ed25519 XXX

vault_ssh_private_key: |
  -----BEGIN OPENSSH PRIVATE KEY-----
  XXX
  -----END OPENSSH PRIVATE KEY-----
```


## Première installation

Lancer le playbook

```bash
echo <SCW_SECRET_KEY> | docker login rg.fr-par.scw.cloud/<NAMESPACE> -u nologin --password-stdin
```

les credentials sont alors stockés dans : `/home/<admin_user>/.docker/config.json`.

```bash
ansible-playbook setup.yaml

# si l'on souhaite n'installer que certaines recettes
ansible-playbook setup.yaml --tags common,user-env
```




## Configuration

Sur notre ordinateur, créer un alias
```bash
# ~/.ssh/config
Host <alias>
  HostName <server-ip-hostname>
  Port 22
  User <admin-user>
```


## Secrets

```bash
ansible-vault encrypt host_vars/millau/vault.yaml
ansible-vault decrypt host_vars/millau/vault.yaml
```

