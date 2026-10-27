import { SMVCartItem, CustomerOrderInfo } from '../types/ecommerce';

export const COMMERCIAL_PHONE = "58779438";
export const COMMERCIAL_PHONE_DISPLAY = "58 779 438";
export const COMMERCIAL_PHONE_INTL = "21658779438";
export const COMMERCIAL_EMAIL = "commercial@smv-trading.com";

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
 * Generates structured, highly professional email body
 */
export function generateProfessionalEmailBody(items: SMVCartItem[], customer: CustomerOrderInfo): string {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const lines = items.map((item, idx) => {
    const lineTotal = item.product.price * item.quantity;
    const unit = item.product.isPerKg ? 'kg' : 'pcs';
    return `${idx + 1}. [Code #${item.product.code}] ${item.product.name} (${item.product.brand})\n   • Quantité : ${item.quantity} ${unit}\n   • Prix unitaire : ${formatDT(item.product.price)}\n   • Total ligne : ${formatDT(lineTotal)}\n   • DLC : ${item.product.dlc} | Cond. : ${item.product.packing}`;
  });

  return `À l'attention du Service Commercial SMV Trading,

Bonjour,

Veuillez trouver ci-dessous le détail de notre commande issue du catalogue officiel SMV Trading (Date : ${today}) :

======================================================================
DÉTAIL DES ARTICLES COMMANDÉS :
======================================================================
${lines.join('\n\n')}

======================================================================
TOTAL INDICATIF DE LA COMMANDE : ${formatDT(total)}
======================================================================

INFORMATIONS DU CLIENT & LIVRAISON :
• Nom du client / Responsable : ${customer.clientName || 'aya'}
• Téléphone de contact : ${customer.clientPhone || '12457482'}
${customer.clientEmail ? `• Email de contact : ${customer.clientEmail}\n` : ''}• Zone de livraison : ${customer.deliveryZone || 'djerba'}
${customer.companyName ? `• Société / Enseigne : ${customer.companyName}\n` : ''}${customer.address ? `• Adresse exacte : ${customer.address}\n` : ''}${customer.notes ? `• Remarques / Instructions : ${customer.notes}\n` : ''}
Merci de bien vouloir nous accuser réception de cette commande et nous confirmer la date de livraison ainsi que les disponibilités en stock.

Dans l'attente de votre retour,

Cordialement,
${customer.clientName || 'Le Client'}
${customer.clientPhone ? `Tél : ${customer.clientPhone}` : ''}`;
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
