// Calcul pur des indicateurs du mois : aucune lecture de fichier, aucun effet de bord.
export const VAT_RATE = 0.2;

const round2 = n => Math.round(n * 100) / 100;

export function computeStats(orders, month) {
  let revenueHT = 0;
  let count = 0;
  const byCategory = {};
  for (const o of orders) {
    if (!o.date.startsWith(month) || o.status === 'CANCELLED') continue;
    count++;
    for (const l of o.lines) {
      const amount = l.qty * l.unitPrice;
      revenueHT += amount;
      byCategory[l.category] = (byCategory[l.category] || 0) + amount;
    }
  }
  const vat = round2(revenueHT * VAT_RATE);
  const revenueTTC = revenueHT + vat;
  const average = count === 0 ? 0 : round2(revenueHT / count);
  return { month, count, revenueHT, vat, revenueTTC, average, byCategory };
}
