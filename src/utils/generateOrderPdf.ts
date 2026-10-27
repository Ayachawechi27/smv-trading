import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SMVCartItem, CustomerOrderInfo } from '../types/ecommerce';
import { formatDT, COMMERCIAL_PHONE_DISPLAY, COMMERCIAL_EMAIL } from './formatters';

interface GeneratePdfOptions {
  items: SMVCartItem[];
  customerInfo: CustomerOrderInfo;
  orderNumber?: string;
}

export function generateOrderPDF({
  items,
  customerInfo,
  orderNumber = `CMD-${Math.floor(10000 + Math.random() * 90000)}`,
}: GeneratePdfOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  // Top emerald accent bar
  doc.setFillColor(6, 95, 70); // #065f46
  doc.rect(0, 0, pageWidth, 7, 'F');

  let currentY = 16;

  // Header Left: SMV Trading info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('SMV TRADING', 14, currentY);

  currentY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70);
  doc.text("IMPORTATEUR ET DISTRIBUTEUR DE PRODUITS ALIMENTAIRES EN TUNISIE", 14, currentY);

  currentY += 4.5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("« Les saveurs du monde, au cœur de vos envies » — Qualité & Gourmandise", 14, currentY);

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Tél Commercial : +216 ${COMMERCIAL_PHONE_DISPLAY}   |   Email : ${COMMERCIAL_EMAIL}`, 14, currentY);

  // Header Right: Order identification
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('BON DE COMMANDE CLIENT', pageWidth - 14, 16, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(6, 95, 70);
  doc.text(`N° ${orderNumber}`, pageWidth - 14, 21.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date d'émission : ${today}`, pageWidth - 14, 26.5, { align: 'right' });

  // Optional: Client logo on header if uploaded
  if (customerInfo.clientLogoUrl && customerInfo.clientLogoUrl.startsWith('data:image')) {
    try {
      doc.addImage(customerInfo.clientLogoUrl, 'PNG', pageWidth - 55, 30, 40, 15, undefined, 'FAST');
    } catch {
      // Ignore if image formatting fails
    }
  }

  currentY += 9;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(14, currentY, pageWidth - 14, currentY);

  currentY += 5;

  // Client Details Box
  const clientBoxY = currentY;
  const clientBoxWidth = (pageWidth - 28 - 6) / 2;

  // Left card: Client identification
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, clientBoxY, clientBoxWidth, 26, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, clientBoxY, clientBoxWidth, 26, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('DONNÉES DU CLIENT / ÉTABLISSEMENT', 18, clientBoxY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  const clientTitle = customerInfo.companyName 
    ? customerInfo.companyName 
    : (customerInfo.clientName || 'Client SMV');
  doc.text(clientTitle.slice(0, 36), 18, clientBoxY + 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Responsable : ${customerInfo.clientName || 'Non précisé'}`, 18, clientBoxY + 16.5);
  doc.text(`Tél : ${customerInfo.clientPhone || 'Non renseigné'}${customerInfo.clientEmail ? ` | Email : ${customerInfo.clientEmail}` : ''}`, 18, clientBoxY + 21.5);

  // Right card: Delivery destination
  const rightBoxX = 14 + clientBoxWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(rightBoxX, clientBoxY, clientBoxWidth, 26, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(rightBoxX, clientBoxY, clientBoxWidth, 26, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('DESTINATION & MODALITÉS DE LIVRAISON', rightBoxX + 4, clientBoxY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(6, 95, 70);
  doc.text(`Zone de livraison : ${customerInfo.deliveryZone || 'Djerba'}`, rightBoxX + 4, clientBoxY + 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Adresse : ${(customerInfo.address || 'Livraison locale').slice(0, 42)}`, rightBoxX + 4, clientBoxY + 16.5);
  if (customerInfo.notes) {
    doc.text(`Instructions : ${customerInfo.notes.slice(0, 40)}`, rightBoxX + 4, clientBoxY + 21.5);
  } else {
    doc.text("Transport sous température contrôlée (chaîne du froid garantie)", rightBoxX + 4, clientBoxY + 21.5);
  }

  currentY = clientBoxY + 30;

  // Table of Items (WITHOUT DLC AS REQUESTED)
  const tableData = items.map((item, index) => {
    const lineTotal = item.product.price * item.quantity;
    const unit = item.product.isPerKg ? 'kg' : 'pcs';
    return [
      (index + 1).toString(),
      `#${item.product.code}`,
      item.product.name,
      item.product.brand,
      item.product.packing,
      `${item.quantity} ${unit}`,
      formatDT(item.product.price),
      formatDT(lineTotal),
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [
      ['N°', 'Code', 'Désignation de l\'article', 'Fournisseur', 'Conditionnement', 'Quantité', 'Prix Unit.', 'Total Ligne']
    ],
    body: tableData,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    headStyles: {
      fillColor: [6, 95, 70], // emerald-800
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 2.2,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [15, 23, 42],
      cellPadding: 2,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 9 },
      1: { halign: 'center', fontStyle: 'bold', cellWidth: 16 },
      2: { cellWidth: 'auto', fontStyle: 'bold' },
      3: { cellWidth: 26 },
      4: { cellWidth: 28, fontSize: 7, textColor: [100, 116, 139] },
      5: { halign: 'center', fontStyle: 'bold', cellWidth: 16 },
      6: { halign: 'right', cellWidth: 22 },
      7: { halign: 'right', fontStyle: 'bold', cellWidth: 25 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didDrawPage: (data) => {
      // Bottom running footer on each page
      const pageH = doc.internal.pageSize.getHeight();
      doc.setDrawColor(226, 232, 240);
      doc.line(14, pageH - 12, pageWidth - 14, pageH - 12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `SMV TRADING · Tél : +216 ${COMMERCIAL_PHONE_DISPLAY} · Email : ${COMMERCIAL_EMAIL} · Document officiel issu du catalogue des prix`,
        14,
        pageH - 7
      );
      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth - 14,
        pageH - 7,
        { align: 'right' }
      );
    },
  });

  // Calculate position after table
  const finalY = (doc as any).lastAutoTable.finalY + 6;

  // Check if we need a new page for total & stamp
  let afterTableY = finalY;
  if (afterTableY > 230) {
    doc.addPage();
    afterTableY = 20;
  }

  // Summary and Totals Box
  const summaryBoxWidth = 85;
  const summaryX = pageWidth - 14 - summaryBoxWidth;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(summaryX, afterTableY, summaryBoxWidth, 24, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(summaryX, afterTableY, summaryBoxWidth, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Nombre de références : ${items.length} article(s)`, summaryX + 4, afterTableY + 5.5);
  doc.text(`Nombre total d'unités commandées : ${totalUnits}`, summaryX + 4, afterTableY + 10.5);

  doc.setDrawColor(203, 213, 225);
  doc.line(summaryX + 4, afterTableY + 13, summaryX + summaryBoxWidth - 4, afterTableY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL INDICATIF :', summaryX + 4, afterTableY + 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(6, 95, 70);
  doc.text(formatDT(total), summaryX + summaryBoxWidth - 4, afterTableY + 19, { align: 'right' });

  // Stamp & Signature Box
  const stampBoxY = afterTableY + 30;
  const stampBoxWidth = (pageWidth - 28 - 6) / 2;

  // Left terms box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, stampBoxY, stampBoxWidth, 34, 2, 2, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ENGAGEMENT ET CONDITIONS FOURNISSEUR', 18, stampBoxY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('• Commande transmise directement au service commercial SMV Trading.', 18, stampBoxY + 12);
  doc.text('• Produits originaux certifiés en direct des usines partenaires.', 18, stampBoxY + 17);
  doc.text('• Transport et livraison sous température contrôlée (chaîne du froid).', 18, stampBoxY + 22);
  doc.text(`• Contact direct commercial : +216 ${COMMERCIAL_PHONE_DISPLAY} | ${COMMERCIAL_EMAIL}`, 18, stampBoxY + 27);

  // Right stamp & signature area
  const rightStampX = 14 + stampBoxWidth + 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(100, 116, 139);
  doc.setLineDashPattern([2, 2], 0);
  doc.roundedRect(rightStampX, stampBoxY, stampBoxWidth, 34, 2, 2, 'S');
  doc.setLineDashPattern([], 0); // reset dash

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CADRE RÉSERVÉ AU CACHET & SIGNATURE CLIENT', rightStampX + 4, stampBoxY + 6);

  // If client stamp image is available, render it!
  if (customerInfo.clientStampUrl && customerInfo.clientStampUrl.startsWith('data:image')) {
    try {
      doc.addImage(customerInfo.clientStampUrl, 'PNG', rightStampX + 10, stampBoxY + 8, stampBoxWidth - 20, 20, undefined, 'FAST');
    } catch {
      // fallback text
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('[ Cachet numérique client apposé ]', rightStampX + stampBoxWidth / 2, stampBoxY + 18, { align: 'center' });
    }
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('[ Apposer ici le Cachet de l\'établissement et la Signature ]', rightStampX + stampBoxWidth / 2, stampBoxY + 18, { align: 'center' });
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date : ${today}  |  Mention : "Bon pour accord et commande"`, rightStampX + 4, stampBoxY + 31);

  // Trigger immediate browser download
  const sanitizedClient = (customerInfo.clientName || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `Bon_de_Commande_SMV_${sanitizedClient}_${orderNumber}.pdf`;
  doc.save(fileName);
}
