import React, { useState } from 'react';
import { X, Mail, Copy, Check, ExternalLink, FileText, Printer, Stamp, Image as ImageIcon, ShieldCheck, Download, FileCheck } from 'lucide-react';
import { SMVCartItem, CustomerOrderInfo } from '../types/ecommerce';
import { generateOrderPDF } from '../utils/generateOrderPdf';
import { 
  COMMERCIAL_EMAIL, 
  formatDT,
  generateEmailSubject, 
  generateProfessionalEmailBody,
  getMailtoUrl,
  getGmailComposeUrl,
  getOutlookComposeUrl
} from '../utils/formatters';

interface EmailOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SMVCartItem[];
  customerInfo: CustomerOrderInfo;
  onSentConfirm?: () => void;
  onOpenPrintOrder?: () => void;
}

export const EmailOrderModal: React.FC<EmailOrderModalProps> = ({
  isOpen,
  onClose,
  items,
  customerInfo,
  onSentConfirm,
  onOpenPrintOrder,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'text'>('table');
  const [sentMarked, setSentMarked] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const handleDownloadPDF = () => {
    generateOrderPDF({ items, customerInfo });
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 3000);
  };

  const subject = generateEmailSubject(items, customerInfo);
  const body = generateProfessionalEmailBody(items, customerInfo);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const mailtoUrl = getMailtoUrl(items, customerInfo);
  const gmailUrl = getGmailComposeUrl(items, customerInfo);
  const outlookUrl = getOutlookComposeUrl(items, customerInfo);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Objet : ${subject}\n\nDestinataire : ${COMMERCIAL_EMAIL}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleConfirmSent = () => {
    setSentMarked(true);
    if (onSentConfirm) onSentConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Transmission de Commande par Email & PDF
              </h3>
              <p className="text-[11px] text-slate-400">
                Service commercial officiel : <strong className="text-emerald-400">{COMMERCIAL_EMAIL}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Banner PDF avec Téléchargement direct & Cachet/Logo */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-800/60 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Stamp className="w-4 h-4 text-amber-400" />
                <span>Bon de Commande Officiel PDF (1-Clic Téléchargement)</span>
              </div>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                Téléchargez le document PDF officiel (.pdf) à joindre à votre email, ou personnalisez-le avec le logo et le cachet de votre établissement.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {pdfDownloaded ? (
                  <>
                    <FileCheck className="w-4 h-4 text-emerald-200" />
                    <span>PDF Téléchargé !</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-emerald-200" />
                    <span>Télécharger PDF</span>
                  </>
                )}
              </button>

              {onOpenPrintOrder && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPrintOrder();
                  }}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  title="Ajouter logo et cachet personnalisé"
                >
                  <Stamp className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Cachet / Logo</span>
                </button>
              )}
            </div>
          </div>

          {/* Email Recipient and Subject Info Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold w-28">Destinataire :</span>
              <div className="flex items-center gap-2 font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>{COMMERCIAL_EMAIL}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold w-28 shrink-0">Objet :</span>
              <span className="font-medium text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200 flex-1">
                {subject}
              </span>
            </div>

            {customerInfo.clientEmail && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-semibold w-28">Email client :</span>
                <span className="font-mono text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                  {customerInfo.clientEmail}
                </span>
              </div>
            )}
          </div>

          {/* Quick Dispatch Buttons (Gmail / Outlook / Default Mail) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1-Clic : Envoyer le mail au commercial :
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              
              {/* Default Mail Client (Outlook / Apple Mail) */}
              <a
                href={mailtoUrl}
                onClick={handleConfirmSent}
                className="p-3 rounded-xl border border-slate-300 hover:border-blue-600 bg-white hover:bg-blue-50/50 transition-all text-left flex flex-col justify-between group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-slate-900">Logiciel Mail</p>
                  <p className="text-[10px] text-slate-500">Outlook, Apple Mail, etc.</p>
                </div>
              </a>

              {/* Gmail Webmail */}
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleConfirmSent}
                className="p-3 rounded-xl border border-slate-300 hover:border-red-600 bg-white hover:bg-red-50/50 transition-all text-left flex flex-col justify-between group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-600 text-sm">G</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600" />
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-slate-900">Gmail Web</p>
                  <p className="text-[10px] text-slate-500">Ouvrir dans Google Mail</p>
                </div>
              </a>

              {/* Outlook Web */}
              <a
                href={outlookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleConfirmSent}
                className="p-3 rounded-xl border border-slate-300 hover:border-sky-600 bg-white hover:bg-sky-50/50 transition-all text-left flex flex-col justify-between group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-600 text-sm">O</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600" />
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-slate-900">Outlook Web</p>
                  <p className="text-[10px] text-slate-500">Hotmail / Office 365</p>
                </div>
              </a>

            </div>
          </div>

          {/* Table Preview and Text Toggle (WITHOUT DLC AS REQUESTED) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tableau Visuel
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('text')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    viewMode === 'text' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Texte Brut
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copié dans le presse-papier !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le mail complet</span>
                  </>
                )}
              </button>
            </div>

            {/* Mode A: Clean Visual HTML Table (NO DLC) */}
            {viewMode === 'table' ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-800 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 w-10 text-center">N°</th>
                      <th className="p-2.5">Code</th>
                      <th className="p-2.5">Désignation</th>
                      <th className="p-2.5">Fournisseur</th>
                      <th className="p-2.5">Conditionnement</th>
                      <th className="p-2.5 text-center">Quantité</th>
                      <th className="p-2.5 text-right">Prix Unit.</th>
                      <th className="p-2.5 text-right">Total Ligne</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr key={item.product.code} className="hover:bg-slate-50">
                        <td className="p-2.5 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="p-2.5 font-mono font-bold text-slate-900">#{item.product.code}</td>
                        <td className="p-2.5 font-semibold text-slate-900">{item.product.name}</td>
                        <td className="p-2.5 text-slate-700">{item.product.brand}</td>
                        <td className="p-2.5 text-slate-500 text-[11px]">{item.product.packing}</td>
                        <td className="p-2.5 text-center font-bold font-mono">
                          {item.quantity} {item.product.isPerKg ? 'kg' : 'pcs'}
                        </td>
                        <td className="p-2.5 text-right font-mono tabular-nums">{formatDT(item.product.price)}</td>
                        <td className="p-2.5 text-right font-mono tabular-nums font-bold text-slate-900">
                          {formatDT(item.product.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
                    <tr>
                      <td colSpan={7} className="p-2.5 text-right uppercase text-[11px] text-slate-600">Total Indicatif :</td>
                      <td className="p-2.5 text-right font-mono text-emerald-800 text-sm">{formatDT(total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              /* Mode B: Raw Plain-text Table (NO DLC) */
              <div className="p-3.5 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner max-h-56 overflow-y-auto">
                {body}
              </div>
            )}

          </div>

          {/* Confirmation Notice */}
          {sentMarked && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Commande préparée pour <strong>{COMMERCIAL_EMAIL}</strong>. Vous pouvez y joindre votre bon de commande imprimé en PDF.</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Format conforme B2B sans DLC · Exportable en PDF avec cachet</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenPrintOrder && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPrintOrder();
                }}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Ouvrir Bon de Commande PDF</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
