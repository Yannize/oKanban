# Use Cases

|En tant que|Je veux pouvoir| Dans le but de| comentaires |
|---|---|---|---|
|Utilisateur| Créer une liste| rajouter une liste au kanban||
|Utilisateur| Consulter les listes| ||
|Utilisateur| Modifier une liste| changer son nom, son ordre ||
|Utilisateur| Supprimer une liste|| Impossible de supprimer une liste non vide |
|Utilisateur| Créer un carte | rajouter une carte dans une liste| impossible de créer une carte sans liste parent|
|Utilisateur| Consulter les cartes | |  on récupèrera les cartes, classées par liste parent |
|Utilisateur| Modfier une carte | changer son contenu, sa couleur, sa position, sa liste parent | |
|Utilisateur| Supprimer une carte | | |
|Utilisateur| Créer un label | pouvoir ensuite l'associer à des cartes | |
|Utilisateur| Consulter les labels | | |
|Utilisateur| Modifier un label | | |
|Utilisateur| Supprimer un label | | un label supprimé est automatiquement dissocié de toutes les cartes |
|Utilisateur| Associer un label à une carte | faire apparaitre le label sur la carte| |
|Utilisateur| Dissocer un label d'une carte | ne plus faire apparaitre le label sur la carte| |

## Petite astuce

Si on a déjà fait le MLD, il suffit de :

- commencer par énumérer le CRUD de chaque entité
- lister ensuite les actions liées aux tables de liaison
- refaire un tour avec les éventuelles demandes spécifique du client