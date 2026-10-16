# NexusStore — configuration requise

Tables DynamoDB attendues :
- Products : clé de partition `productId`
- Cart : clé de partition `userId`, clé de tri `productId`
- Wishlist : clé de partition `userId`, clé de tri `productId`
- Orders : clé de partition `orderId`

Configurer AWS_REGION et les quatre noms de tables dans l'environnement d'exécution.
Les permissions IAM doivent autoriser uniquement les opérations nécessaires sur ces tables.

Cognito : configurer un User Pool, un client d'application et l'issuer OIDC.
AUTH_SECRET doit être une valeur aléatoire forte. Ne pas committer les secrets.

Stripe : commencer avec des clés de test. Configurer un webhook pointant vers
/api/webhooks/stripe et abonner l'événement checkout.session.completed.

Avant la production : ajouter une transaction atomique de réservation/décrémentation
de stock, une gestion complète des commandes, des tests de webhooks/idempotence,
et vérifier la devise ainsi que les règles de livraison/taxes. Ne pas vendre avant.
