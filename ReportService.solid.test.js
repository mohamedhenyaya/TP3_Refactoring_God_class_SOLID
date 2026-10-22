// Tests qui prouvent le refactoring : OCP (nouveau format), LSP (offre gratuite), DIP (faux injectés).
// Lancer : node --test seance3-solid/tp3-nom1-nom2/ReportService.solid.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildReportService } from './main.js';
import { computeStats } from './domain/salesStats.js';
import { FREE_POLICY } from './domain/ReportPolicy.js';

// Faux en mémoire : aucun fichier, aucune console, horloge figée.
const ORDERS = [
  { date: '2026-09-02', status: 'PAID', lines: [{ category: 'informatique', qty: 2, unitPrice: 50 }] },
  { date: '2026-09-03', status: 'CANCELLED', lines: [{ category: 'livres', qty: 1, unitPrice: 999 }] },
];
const inMemoryOrders = { all: () => ORDERS };
const silentLogger = () => ({ lines: [], info(m) { this.lines.push(m); } });

test('un format Markdown s’ajoute sans modifier ReportService', () => {
  const { service, formatters } = buildReportService({ logger: silentLogger() });
  formatters.register('md', {
    format: s => `# Ventes ${s.month}\n\n` +
      Object.keys(s.byCategory).sort().map(c => `- ${c} : ${s.byCategory[c]} €`).join('\n') +
      `\n\n**Total TTC : ${s.revenueTTC} €**\n`,
  });
  assert.equal(service.generate('2026-09', 'md'),
    '# Ventes 2026-09\n\n- informatique : 416 €\n- livres : 135 €\n\n**Total TTC : 661.2 €**\n');
});

test('computeStats est un calcul pur, testable sans orders.json', () => {
  assert.deepEqual(computeStats(ORDERS, '2026-09'), {
    month: '2026-09', count: 1, revenueHT: 100, vat: 20, revenueTTC: 120,
    average: 100, byCategory: { informatique: 100 },
  });
});

test('dépôt, mailer et logger sont remplaçables par injection', () => {
  const sent = [];
  const logger = silentLogger();
  const { service } = buildReportService({ orders: inMemoryOrders, mailer: { send: m => sent.push(m) }, logger });
  service.generate('2026-09', 'csv', 'compta@shoplite.fr');
  assert.equal(sent.length, 1);
  assert.equal(sent[0].subject, 'Rapport des ventes 2026-09');
  assert.deepEqual(logger.lines, ['rapport 2026-09 (csv) : 1 commande(s)']);
});

test('offre gratuite : une politique injectée, plus une sous-classe', () => {
  const { service } = buildReportService({ policy: FREE_POLICY, logger: silentLogger() });
  assert.equal(FREE_POLICY.allowsFormat('html'), false); // l'appelant peut demander avant d'appeler
  assert.match(service.generate('2026-09', 'csv'), /^categorie;montant_ht/);
  assert.throws(() => service.generate('2026-09', 'html'), /réservé aux comptes Pro/);
  assert.throws(() => service.generate('2026-09', 'csv', 'a@b.fr'), /réservé aux comptes Pro/);
});
