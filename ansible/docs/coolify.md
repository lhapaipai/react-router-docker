## Connexion avec Coolify

Coolify essaiera de se connecter en tant que root avec sa clé privée. il faut donc ajouter la clé publique de coolify dans `/root/.ssh/authorized_keys`.

```bash
ssh root@xxx.xxx.xxx.xxx
echo "ssh-rsa XXXXX coolify.io" >> /root/.ssh/authorized_keys
```

on peut maintenant ajouter notre nouvelle instance en tant que **Server** dans l'interface de Coolify.

## Issues

je rencontre des problèmes avec Coolify si j'ai activé le pare feu ufw et que je limite les connexions ssh avec ufw : la limite est trop faible. du coup pour le moment j'ai autorisé ssh comme les autres.