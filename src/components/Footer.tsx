import React from 'react';
import { Phone, Mail, MessageSquare, FileText, CheckCircle } from 'lucide-react';
import { COMMERCIAL_PHONE_DISPLAY, COMMERCIAL_PHONE_INTL, COMMERCIAL_EMAIL } from '../utils/formatters';

interface FooterProps {
  onOpenPdfModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPdfModal }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/products/catalog/smv_trading_logo.png"
                alt="SMV TRADING"
                className="h-10 w-auto object-contain bg-white rounded p-1"
              />
              <span className="font-bold text-xl text-white tracking-tight">SMV TRADING</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Grossiste et importateur de produits agroalimentaires de premier choix en Tunisie : 
              fromages AOP et de tradition, charcuterie Halal et spécialités de porc.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p>Catalogue des prix officiel — Mise à jour Septembre 2025 / 2026</p>
              <p className="text-emerald-400 font-medium">Distribution active sur toute la Tunisie</p>
            </div>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white">Contact Service Commercial</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={`tel:+${COMMERCIAL_PHONE_INTL}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Tél Commercial : <strong>+216 {COMMERCIAL_PHONE_DISPLAY}</strong></span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMMERCIAL_EMAIL}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>Email : {COMMERCIAL_EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${COMMERCIAL_PHONE_INTL}?text=${encodeURIComponent('Bonjour SMV Trading, je souhaite commander.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Commander via WhatsApp (+216 {COMMERCIAL_PHONE_DISPLAY})</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white">Documents</h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={onOpenPdfModal}
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Feuilleter le catalogue PDF</span>
              </button>
              <a
                href="/assets/aistudio/LISTE_DES_PRIX_SMV_TRADING_30-04-2026_1adf8611.pdf"
                download="LISTE_DES_PRIX_SMV_TRADING.pdf"
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Télécharger la liste des prix (PDF)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SMV TRADING. Tous droits réservés.</p>
          <p className="text-slate-400 text-[11px]">
            Fournisseurs : Paysan Breton · Zanetti · Entremont · Soignon · Bastides · Volys Star · Jean Caby · Mère Lalie
          </p>
        </div>

      </div>
    </footer>
  );
};
