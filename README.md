# TP 3 · Refactoring d'une « God class » (SOLID et injection de dépendances)

**Architecture Logicielle · M1 INGETIS · parcours Dev**
Travail réalisé en monôme par **Mohamedhen YAYA** · 22 octobre 2026

Refactoring du `ReportService` de ShopLite (rapport mensuel des ventes) sans changer son comportement.

## Lancer

```bash
npm test      # 8 tests de caractérisation + 4 tests SOLID (Node >= 20)
npm start     # même sortie que demo.js du code de départ
```

## Contenu

| Élément | Fichier(s) |
|---|---|
| Diagnostic des violations SOLID | [VIOLATIONS.md](VIOLATIONS.md) |
| Tests de caractérisation (7 fournis + CSV d'octobre) | `ReportService.caracterisation.test.js` |
| Preuves OCP / LSP / DIP (format Markdown, offre gratuite, faux injectés) | `ReportService.solid.test.js` |
| Calcul pur, adresse e-mail, politique d'offre | `domain/` |
| Un formatter par format + registre | `formatters/` |
| Fichier de commandes, SMTP, journal | `infrastructure/` |
| Orchestration sans aucune création de dépendance | `application/ReportService.js` |
| Composition root, configuration SMTP via l'environnement | `main.js`, `.env.example` |

## Choix principaux

- **Offre gratuite** : la sous-classe `FreeReportService` (violation de Liskov) est remplacée par une `ReportPolicy` injectée (`PRO_POLICY`, `FREE_POLICY`), que l'appelant peut interroger avant l'appel (`allowsFormat`, `allowsEmail`).
- **Nouveau format** : `formatters.register('md', ...)` suffit, `ReportService` n'est pas modifié.
- **Secrets** : plus aucun mot de passe dans le code ; `SMTP_PASSWORD` vient de l'environnement.
