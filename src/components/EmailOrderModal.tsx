import React, { useState } from 'react';
import { X, Mail, Copy, Check, ExternalLink, Send, Building, ShieldCheck } from 'lucide-react';
import { SMVCartItem, CustomerOrderInfo } from '../types/ecommerce';
import { 
  COMMERCIAL_EMAIL, 
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
}

export const EmailOrderModal: React.FC<EmailOrderModalProps> = ({
  isOpen,
  onClose,
  items,
  customerInfo,
  onSentConfirm,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [sentMarked, setSentMarked] = useState(false);

  const subject = generateEmailSubject(items, customerInfo);
  const body = generateProfessionalEmailBody(items, customerInfo);

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
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-6 animate-in zoom-in-95 duration-200"
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
                Transmission par Email Professionnel
              </h3>
              <p className="text-[11px] text-slate-400">
                Envoi direct au service commercial : <strong className="text-emerald-400">{COMMERCIAL_EMAIL}</strong>
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
              <span className="text-slate-500 font-semibold w-28 shrink-0">Objet du mail :</span>
              <span className="font-medium text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200 flex-1">
                {subject}
              </span>
            </div>

            {customerInfo.clientEmail && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-slate-500 font-semibold w-28">Copie client :</span>
                <span className="font-mono text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                  {customerInfo.clientEmail}
                </span>
              </div>
            )}
          </div>

          {/* Quick Dispatch Buttons (Gmail / Outlook / Default Mail) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Choisissez votre moyen d'envoi :
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

          {/* Body Preview with Copy Option */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Contenu du message professionnel :</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 transition-colors"
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

            <div className="p-3.5 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner max-h-56 overflow-y-auto">
              {body}
            </div>
          </div>

          {/* Confirmation Notice */}
          {sentMarked && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Commande préparée pour <strong>{COMMERCIAL_EMAIL}</strong>. Le service commercial vous contactera dès réception.</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Destinataire officiel : <strong>{COMMERCIAL_EMAIL}</strong>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
