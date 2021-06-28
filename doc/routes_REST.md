
| URL | GET | POST | PATCH | DELETE |
|---|---|---|---|---|
|/list| récupérer toutes les listes | créer une liste à partir du body | mettre à jour TOUTES les listes à partir du body | supprime toutes les listes ! |
|/list/:id| récupérer LA liste ciblée | N/A | mettre à jour LA liste ciblée avec les données du body | supprime la liste ciblée.|

- on recommence pour /card et /label ...
- il manquera encore 2 routes, pour associer et dissocer cartes et labels:
  - Associer: `POST /card/:card_id/label/:label_id`
  - Dissocier: `DELETE /card/:card_id/label/:label_id`
