les dépendances `@prisma/client`, `prisma` et `prisma-json-types-generator` sont uniquement nécessaires pour lancer la commande

```bash
pnpm prisma generate
```

dans la version dockerisée de l'App.

En effet, lors d'un `pnpm deploy`, pnpm regarde les dépendances de `front` or ce paquet a fusionné
avec le paquet `prisma-client` donc `pnpm` ne va pas installer ses dépendances ni ne lancer la commande de postinstall de `prisma-client`.

on doit dont appeler `pnpm prisma generate` sur `/front`, il faut donc 
- créer le dossier `/front/prisma/prisma.schema`
- ajouter `prisma` et `prisma-json-types-generator` et `@prisma/client` dans les dépendances.