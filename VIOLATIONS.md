# TP 3 · Violations SOLID dans `ReportService.js` (code de départ)

Les numéros de ligne renvoient au fichier de départ `seance3-solid/tp3/ReportService.js`.

| # | Principe | Ligne(s) | Problème | Conséquence concrète |
|---|----------|----------|----------|----------------------|
| 1 | **S** (responsabilité unique) | 20-73 | `generate()` lit les données, calcule, met en forme, journalise et envoie l'e-mail. | Le comptable (TVA), le marketing (HTML), l'exploitation (logs) et l'admin système (SMTP) viennent tous modifier la même méthode, ce qui crée des conflits Git et des régressions croisées. On ne peut pas tester le calcul seul. |
| 2 | **O** (ouvert/fermé) | 42-55 | Une chaîne `if / else if` sur `format`. | Pour ajouter un format (PDF, Markdown), il faut rouvrir et retester une classe qui fonctionne déjà. La chaîne grossit à chaque format. |
| 3 | **L** (substitution de Liskov) | 77-83 | `FreeReportService` refuse ce que le parent accepte (formats autres que CSV, e-mail). | Un code écrit pour `ReportService` plante quand il reçoit un `FreeReportService` : la sous-classe ne tient pas les promesses du parent, et l'appelant doit faire des `instanceof`. |
| 4 | **D** (inversion des dépendances) / DI | 4, 8-11, 15-18 | `import fs`, le chemin vers `orders.json` et la configuration SMTP sont créés dans le constructeur. | Impossible de tester le calcul sans le fichier réel, ni d'utiliser une base de données ou un vrai SMTP sans modifier la classe. Le métier dépend de la technique. |
| 5 | **Autre** (sécurité) | 10 | Le mot de passe SMTP (`password: '…'`) est en clair dans le code. | Le secret se retrouve dans le dépôt Git et son historique : toute personne qui a accès au dépôt a le mot de passe. Pour le changer, il faut redéployer le code. |
| 6 | **D** / testabilité | 58-60 | `new Date()` et `console.log` sont appelés directement dans le métier. | La sortie change à chaque exécution (horodatage) et pollue les tests. On ne peut ni figer l'heure ni rediriger les journaux. |
| 7 | **I** / encapsulation | 10-12 | `smtp`, `outbox` et `history` sont des champs publics du service. | Les clients voient (et peuvent modifier) le mot de passe et la boîte d'envoi. Ceux qui veulent seulement un rapport dépendent d'une interface bien trop large. |
| 8 | **Autre** (validation) | 64 | La validité d'une adresse se limite à `includes('@')`, enfouie dans `generate`. | `"@"` ou `"a@"` sont acceptées. La règle n'est pas réutilisable et elle est vérifiée **après** la mise en forme et la journalisation. |
