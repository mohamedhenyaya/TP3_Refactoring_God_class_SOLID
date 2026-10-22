// Politique d'offre injectée dans ReportService et connue de l'appelant.
// Elle remplace la sous-classe FreeReportService, qui violait Liskov : il n'y a plus
// qu'un seul ReportService, dont le contrat annonce que la politique peut refuser.
export class ReportPolicy {
  constructor({ name, formats = null, email = true }) {
    this.name = name;
    this.formats = formats; // null = tous les formats
    this.email = email;
  }

  allowsFormat(format) {
    return this.formats === null || this.formats.includes(format);
  }

  allowsEmail() {
    return this.email;
  }

  check(format, recipient) {
    if (!this.allowsFormat(format)) throw new Error('Format réservé aux comptes Pro');
    if (recipient && !this.allowsEmail()) throw new Error('Envoi par e-mail réservé aux comptes Pro');
  }
}

export const PRO_POLICY = new ReportPolicy({ name: 'pro' });
export const FREE_POLICY = new ReportPolicy({ name: 'free', formats: ['csv'], email: false });
