// Simulation d'un serveur SMTP : les messages sont gardés dans outbox.
// La configuration (dont le mot de passe) est reçue et privée, jamais écrite dans le code.
export class SmtpMailer {
  #config;

  constructor({ host, port, user, password }) {
    this.#config = { host, port, user, password };
    this.outbox = [];
  }

  send({ to, subject, body }) {
    this.outbox.push({ via: `${this.#config.host}:${this.#config.port}`, to, subject, body });
  }
}
