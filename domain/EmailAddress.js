// Objet-valeur : une adresse e-mail valide, ou une exception à la construction.
// La règle reste celle du code de départ (includes('@')) pour ne pas changer le comportement.
export class EmailAddress {
  constructor(value) {
    if (typeof value !== 'string' || !value.includes('@')) throw new Error(`Adresse invalide : ${value}`);
    this.value = value;
    Object.freeze(this);
  }

  toString() {
    return this.value;
  }
}
