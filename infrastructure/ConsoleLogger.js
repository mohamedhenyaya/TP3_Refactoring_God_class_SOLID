// Journal horodaté. L'horloge et la sortie sont injectables pour figer l'heure dans un test.
export class ConsoleLogger {
  constructor({ clock = () => new Date(), output = console } = {}) {
    this.clock = clock;
    this.output = output;
    this.history = [];
  }

  info(message) {
    const line = `[${this.clock().toISOString()}] ${message}`;
    this.output.log(line);
    this.history.push(line);
  }
}
