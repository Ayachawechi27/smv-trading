import { SMVCartItem, CustomerOrderInfo } from '../types/ecommerce';

export const COMMERCIAL_PHONE = "58779438";
export const COMMERCIAL_PHONE_DISPLAY = "58 779 438";
export const COMMERCIAL_PHONE_INTL = "21658779438";
export const COMMERCIAL_EMAIL = "commercial@smv-trading.com";
export const COMMERCIAL_FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61595222526957&locale=fr_FR";

/**
 * Format DT with 3 decimals (Tunisian Millimes), e.g. "285 728,380 DT"
 */
export function formatDT(amount: number): string {
  const fixed = amount.toFixed(3);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formattedInt},${decPart} DT`;
}

/**
 * Generates the EXACT order message requested by the user:
 * 
 * Bonjour SMV Trading, je souhaite commander :
 * - 7016 Madame Loïk AFH 150Gr (Paysan Breton) x 1 pcs
 * - 7025 Brique Tradition 180Gr (Paysan Breton) x 8 pcs
 * - 7048 B. Chèvre Cendrée 100Gr (Paysan Breton) x 20110 pcs
 * 
 * Total indicatif : 285 728,380 DT
 * 
 * Client : aya
 * Téléphone : 12457482
 * Zone de livraison : djerba
 */
export function generateCommercialMessage(items: SMVCartItem[], customer: CustomerOrderInfo): string {
  const itemsText = items
    .map(
      (item) =>
        `- ${item.product.code} ${item.product.name} (${item.product.brand}) x ${item.quantity} ${
          item.product.isPerKg ? 'kg' : 'pcs'
        }`
    )
    .join('\n');

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let msg = `Bonjour SMV Trading, je souhaite commander :\n${itemsText}\n\nTotal indicatif : ${formatDT(total)}\n\nClient : ${customer.clientName}\nTéléphone : ${customer.clientPhone}\nZone de livraison : ${customer.deliveryZone}`;

  if (customer.clientEmail && customer.clientEmail.trim()) {
    msg += `\nEmail client : ${customer.clientEmail.trim()}`;
  }
  if (customer.companyName && customer.companyName.trim()) {
    msg += `\nSociété / Enseigne : ${customer.companyName.trim()}`;
  }
  if (customer.address && customer.address.trim()) {
    msg += `\nAdresse : ${customer.address.trim()}`;
  }
  if (customer.notes && customer.notes.trim()) {
    msg += `\nRemarques : ${customer.notes.trim()}`;
  }

  return msg;
}

/**
 * Generates professional email subject
 */
export function generateEmailSubject(items: SMVCartItem[], customer: CustomerOrderInfo): string {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const client = customer.clientName || 'Client';
  const zone = customer.deliveryZone || 'Tunisie';
  return `[Bon de Commande SMV Trading] - ${client} (${zone}) - Total : ${formatDT(total)}`;
}

/**
 * Generates structured, highly professional email body formatted as a clean table (WITHOUT DLC)
 */
export function generateProfessionalEmailBody(items: SMVCartItem[], customer: CustomerOrderInfo): string {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Table rows without DLC as requested
  const tableRows = items.map((item, idx) => {
    const lineTotal = item.product.price * item.quantity;
    const unit = item.product.isPerKg ? 'kg' : 'pcs';
    const num = String(idx + 1).padEnd(2, ' ');
    const code = String(item.product.code).padEnd(6, ' ');
    const name = item.product.name.slice(0, 32).padEnd(32, ' ');
    const brand = item.product.brand.slice(0, 16).padEnd(16, ' ');
    const packing = item.product.packing.slice(0, 20).padEnd(20, ' ');
    const qty = `${item.quantity} ${unit}`.padStart(10, ' ');
    const pu = formatDT(item.product.price).padStart(12, ' ');
    const tot = formatDT(lineTotal).padStart(14, ' ');
    return `| ${num} | ${code} | ${name} | ${brand} | ${packing} | ${qty} | ${pu} | ${tot} |`;
  });

  const divider = "+----+--------+----------------------------------+------------------+----------------------+------------+--------------+----------------+";
  const header =  "| N° | Code   | Désignation Article              | Fournisseur      | Conditionnement      | Quantité   | Prix Unit.   | Total Ligne    |";

  const tableText = `${divider}\n${header}\n${divider}\n${tableRows.join('\n')}\n${divider}`;

  return `À l'attention du Service Commercial SMV Trading,

Bonjour,

Veuillez trouver ci-dessous le bon de commande de notre établissement issu du catalogue officiel SMV Trading (Date : ${today}) :

TABLEAU DES ARTICLES COMMANDÉS :
${tableText}

TOTAL INDICATIF : ${formatDT(total)}

COORDONNÉES CLIENT & FACTURATION :
• Nom du client / Responsable : ${customer.clientName || 'aya'}
• Téléphone : ${customer.clientPhone || '12457482'}
${customer.clientEmail ? `• Email professionnel : ${customer.clientEmail}\n` : ''}• Zone de livraison : ${customer.deliveryZone || 'djerba'}
${customer.companyName ? `• Établissement / Société : ${customer.companyName}\n` : ''}${customer.address ? `• Adresse exacte de livraison : ${customer.address}\n` : ''}${customer.notes ? `• Remarques : ${customer.notes}\n` : ''}
Note : Le bon de commande officiel (PDF) avec le cachet et la signature de notre entreprise est également disponible pour validation comptable.

Merci de bien vouloir nous accuser réception et nous confirmer la disponibilité ainsi que la date de livraison.

Cordialement,
${customer.clientName || 'Le Responsable'}
${customer.companyName ? `${customer.companyName}\n` : ''}${customer.clientPhone ? `Tél : ${customer.clientPhone}` : ''}`;
}

/**
 * URL helpers for Email Sending
 */
export function getMailtoUrl(items: SMVCartItem[], customer: CustomerOrderInfo): string {
  const subject = generateEmailSubject(items, customer);
  const body = generateProfessionalEmailBody(items, customer);
  return `mailto:${COMMERCIAL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getGmailComposeUrl(items: SMVCartItem[], customer: CustomerOrderInfo): string {
  const subject = generateEmailSubject(items, customer);
  const body = generateProfessionalEmailBody(items, customer);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${COMMERCIAL_EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getOutlookComposeUrl(items: SMVCartItem[], customer: CustomerOrderInfo): string {
  const subject = generateEmailSubject(items, customer);
  const body = generateProfessionalEmailBody(items, customer);
  return `https://outlook.live.com/mail/0/deeplink/compose?to=${COMMERCIAL_EMAIL}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
