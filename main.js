// Composition root : le seul endroit qui crée les objets concrets et les assemble.
// Lancer : node seance3-solid/tp3-nom1-nom2/main.js
import { pathToFileURL } from 'node:url';
import { ReportService } from './application/ReportService.js';
import { PRO_POLICY } from './domain/ReportPolicy.js';
import { CsvFormatter } from './formatters/CsvFormatter.js';
import { HtmlFormatter } from './formatters/HtmlFormatter.js';
import { JsonFormatter } from './formatters/JsonFormatter.js';
import { FormatterRegistry } from './formatters/FormatterRegistry.js';
import { JsonFileOrderRepository } from './infrastructure/JsonFileOrderRepository.js';
import { SmtpMailer } from './infrastructure/SmtpMailer.js';
import { ConsoleLogger } from './infrastructure/ConsoleLogger.js';

// Configuration SMTP lue dans l'environnement : le mot de passe n'est plus dans le code.
export function smtpConfigFromEnv(env = process.env) {
  return {
    host: env.SMTP_HOST ?? 'smtp.shoplite.fr',
    port: Number(env.SMTP_PORT ?? 587),
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
  };
}

export function buildFormatterRegistry() {
  return new FormatterRegistry()
    .register('csv', new CsvFormatter())
    .register('html', new HtmlFormatter())
    .register('json', new JsonFormatter());
}

// Chaque dépendance peut être remplacée (tests, offre gratuite, autre stockage...).
export function buildReportService({
  orders = new JsonFileOrderRepository(new URL('./orders.json', import.meta.url)),
  formatters = buildFormatterRegistry(),
  mailer = new SmtpMailer(smtpConfigFromEnv()),
  logger = new ConsoleLogger(),
  policy = PRO_POLICY,
} = {}) {
  const service = new ReportService({ orders, formatters, mailer, logger, policy });
  return { service, orders, formatters, mailer, logger, policy };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { service, mailer } = buildReportService();
  console.log(service.generate('2026-09', 'csv'));
  console.log(service.generate('2026-09', 'html', 'direction@shoplite.fr'));
  console.log('E-mails envoyés :', mailer.outbox.length);
}
