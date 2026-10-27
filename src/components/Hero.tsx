import React from 'react';
import { Phone, MessageSquare, Download, CheckCircle, Package, Truck, Clock, Mail } from 'lucide-react';
import { COMMERCIAL_PHONE_DISPLAY, COMMERCIAL_PHONE_INTL, COMMERCIAL_EMAIL } from '../utils/formatters';

interface HeroProps {
  totalProductsCount: number;
  onExploreClick: () => void;
  onOpenPdfModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ totalProductsCount, onExploreClick, onOpenPdfModal }) => {
  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-8 pb-12 lg:pt-12 lg:pb-16 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>LISTE DES PRIX OFFICIELLE · SMV TRADING</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Catalogue & Bon de Commande Direct
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Retrouvez l'intégralité de nos <strong>{totalProductsCount} articles</strong> avec leurs codes officiels, 
              fournisseurs de prestige, DLC et conditionnements par carton. 
              Ajoutez vos quantités désirées et <strong>transmettez instantanément votre commande au commercial</strong> par WhatsApp ou SMS.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreClick}
                className="px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>Parcourir le Catalogue</span>
              </button>

              <a
                href={`https://wa.me/${COMMERCIAL_PHONE_INTL}?text=${encodeURIComponent('Bonjour SMV Trading, je souhaite passer une commande directe.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp : {COMMERCIAL_PHONE_DISPLAY}</span>
              </a>

              <button
                onClick={onOpenPdfModal}
                className="px-4 py-3 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Consulter le PDF</span>
              </button>
            </div>

            {/* Live Service Guarantee Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Prix en Dinars Tunisiens (DT)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Livraison toutes zones (Grand Tunis, Djerba, Sahel, etc.)</span>
              </div>
            </div>

          </div>

          {/* Right Card: Quick Commercial Direct Info */}
          <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/products/catalog/smv_trading_logo.png"
                  alt="SMV TRADING"
                  className="h-10 w-auto object-contain bg-white rounded p-1"
                />
                <div>
                  <h3 className="font-bold text-white text-base">Service Commercial</h3>
                  <p className="text-xs text-emerald-400 font-medium">Réception directe des commandes</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                Ligne Directe
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-700/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  Téléphone :
                </span>
                <a href={`tel:+${COMMERCIAL_PHONE_INTL}`} className="font-bold font-mono text-white hover:text-emerald-300">
                  +216 {COMMERCIAL_PHONE_DISPLAY}
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-700/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  WhatsApp :
                </span>
                <span className="font-bold text-emerald-300">
                  Envoi en 1 clic depuis le panier
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-700/60">
                <span className="text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  Email Professionnel :
                </span>
                <a href={`mailto:${COMMERCIAL_EMAIL}`} className="font-mono text-emerald-300 font-semibold hover:underline">
                  {COMMERCIAL_EMAIL}
                </a>
              </div>
            </div>

            {/* Example snippet from prompt */}
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-sans font-semibold tracking-wider">Format automatique de commande :</p>
              <p className="text-emerald-400">« Bonjour SMV Trading, je souhaite commander :</p>
              <p className="text-slate-400 truncate">- 7016 Madame Loïk AFH 150Gr x 1 pcs...</p>
              <p className="text-slate-400">Total indicatif : ... DT · Client : aya · Zone : djerba »</p>
            </div>

          </div>

        </div>

        {/* Partner Brands Strip */}
        <div className="pt-6 border-t border-slate-700/80">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3">
            Marques & Fournisseurs Officiels Partenaires
          </p>
          <div className="bg-white/95 rounded-xl p-3 shadow-inner overflow-hidden">
            <img
              src="/products/catalog/brands_strip.png"
              alt="Partenaires SMV Trading : Paysan Breton, Zanetti, Entremont, Soignon, Bastides, Volys Star, Jean Caby, etc."
              className="w-full max-h-16 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};
