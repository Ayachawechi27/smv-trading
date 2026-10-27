import React from 'react';
import { 
  Phone, 
  MessageSquare, 
  Download, 
  CheckCircle, 
  Package, 
  Truck, 
  Mail, 
  Facebook, 
  Sparkles,
  ShoppingBag,
  Store,
  Building2,
  ChevronRight
} from 'lucide-react';
import { 
  COMMERCIAL_PHONE_DISPLAY, 
  COMMERCIAL_PHONE_INTL, 
  COMMERCIAL_EMAIL, 
  COMMERCIAL_FACEBOOK_URL 
} from '../utils/formatters';

interface HeroProps {
  totalProductsCount: number;
  onExploreClick: () => void;
  onOpenPdfModal: () => void;
  onExplorePromotions?: () => void;
  onOpenContact?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  totalProductsCount, 
  onExploreClick, 
  onOpenPdfModal,
  onExplorePromotions,
  onOpenContact
}) => {
  return (
    <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white pt-8 pb-14 lg:pt-12 lg:pb-18 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Grid: Welcome Presentation & Direct Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Official Welcome Text with Slogan & 2 Main Buttons */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Slogan Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-wide">Importation • Distribution • Qualité • Gourmandise</span>
            </div>

            {/* Main Welcome Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Bienvenue chez SMV Trading
              </h1>
              <p className="text-lg sm:text-xl font-bold text-emerald-400 italic">
                « Les saveurs du monde, au cœur de vos envies ! »
              </p>
            </div>

            {/* Official Welcoming Body Paragraph */}
            <div className="text-sm sm:text-base text-slate-300 leading-relaxed space-y-3 font-normal">
              <p>
                Découvrez <strong>SMV Trading</strong>, votre partenaire en produits alimentaires importés en Tunisie. 
                Nous mettons à votre disposition une sélection gourmande de <strong>fromages</strong>, de <strong>charcuteries</strong>, 
                de produits laitiers et de nombreuses spécialités pour répondre aux exigences des professionnels comme aux envies des particuliers.
              </p>
              <p>
                Que vous soyez grossiste, restaurateur, hôtelier ou commerçant, nous vous accompagnons avec une offre adaptée à votre activité. 
                Et pour les amateurs de bonne cuisine, retrouvez nos produits dans les magasins <strong>Carrefour</strong>, <strong>Monoprix</strong>, <strong>MG</strong> et <strong>Anouar</strong>.
              </p>
              <p className="text-emerald-300 font-semibold pt-1">
                SMV Trading : la qualité, la diversité et le goût au service de vos envies.
              </p>
            </div>

            {/* The 2 Primary Action Buttons requested: « Nos produits » and « Contactez-nous » */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              
              {/* Button 1: Nos produits */}
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg hover:shadow-emerald-900/40 transition-all cursor-pointer flex items-center gap-2.5 group"
              >
                <Package className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
                <span>Nos produits</span>
                <ChevronRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Button 2: Contactez-nous */}
              <a
                href={`tel:+${COMMERCIAL_PHONE_INTL}`}
                className="px-6 py-3.5 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-slate-950" />
                <span>Contactez-nous</span>
              </a>

              {/* Secondary WhatsApp Button */}
              <a
                href={`https://wa.me/${COMMERCIAL_PHONE_INTL}?text=${encodeURIComponent('Bonjour SMV Trading, je souhaite avoir des informations sur vos produits et passer une commande.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp : {COMMERCIAL_PHONE_DISPLAY}</span>
              </a>

              {/* Maasdam Promo Jump */}
              {onExplorePromotions && (
                <button
                  onClick={onExplorePromotions}
                  className="px-4 py-3.5 text-xs sm:text-sm font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span>Promo -16% Maasdam</span>
                </button>
              )}

            </div>

            {/* Quick Guarantees & Retail Availability */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                <Store className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Disponible en GMS : <strong>Carrefour, Monoprix, MG, Anouar</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Livraison assurée sous chaîne du froid garantie</span>
              </div>
            </div>

          </div>

          {/* Right Card: Commercial Direct Contact Desk & Official PDF */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/products/catalog/smv_trading_logo.png"
                  alt="SMV TRADING"
                  className="h-12 w-auto object-contain bg-white rounded-xl p-1.5 shadow-sm"
                />
                <div>
                  <h3 className="font-extrabold text-white text-base">Service Commercial SMV</h3>
                  <p className="text-xs text-emerald-400 font-medium">Commandes directes & Tarifs grossiste</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                Direct
              </span>
            </div>

            {/* Contact Information List */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  Téléphone Commercial :
                </span>
                <a href={`tel:+${COMMERCIAL_PHONE_INTL}`} className="font-bold font-mono text-white hover:text-emerald-300 transition-colors">
                  +216 {COMMERCIAL_PHONE_DISPLAY}
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  Email Professionnel :
                </span>
                <a href={`mailto:${COMMERCIAL_EMAIL}`} className="font-mono text-emerald-300 font-semibold hover:underline">
                  {COMMERCIAL_EMAIL}
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-400 fill-current" />
                  Page Facebook :
                </span>
                <a
                  href={COMMERCIAL_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
                >
                  SMV Trading (Officiel)
                </a>
              </div>
            </div>

            {/* Official PDF Catalog button */}
            <div className="pt-1">
              <button
                onClick={onOpenPdfModal}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Consulter le Catalogue Original des Prix (PDF)</span>
              </button>
            </div>

            {/* Active Promo Callout */}
            <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/30 text-[11px] text-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">PROMO -16%</span>
                <span className="font-medium truncate">Maasdam Holland 13 KG (#7C02)</span>
              </div>
              <span className="font-bold font-mono text-amber-300 shrink-0">54,600 DT/kg</span>
            </div>

          </div>

        </div>

        {/* Large & Highly Visible Partner Brands Banner */}
        <div className="pt-8 border-t border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-400 font-extrabold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Marques & Fournisseurs Officiels Partenaires
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Importation directe d'Europe · 100% Produits d'Origine Certifiée
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Fromages AOP & Charcuteries de Prestige
            </span>
          </div>

          {/* Expanded, Crisp, High-Visibility Banner Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200/90 flex flex-col items-center justify-center overflow-hidden">
            <img
              src="/assets/aistudio/marques_partenaires_smv.png"
              alt="Partenaires SMV Trading : Bastides, Jean Caby, Mère Lalie, San Michele, Paysan Breton, Zanetti, Papillon, Cœur de Lion, Grand Or, Soignon, Entremont, Natais, Volys, Caprice des Dieux, Fol Epi, Saint Agur, Vieux Pané, Saint Albray, Chaumes"
              className="w-full max-w-5xl h-auto object-contain filter drop-shadow-xs transition-transform duration-300 hover:scale-[1.02]"
            />
            
            {/* Brands text footer list for maximum accessibility */}
            <div className="mt-4 pt-3 border-t border-slate-100 w-full text-center">
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Bastides • Jean Caby • Mère Lalie • San Michele • Paysan Breton • Zanetti • Papillon • Cœur de Lion • Grand'Or • Soignon • Entremont • Volys • Caprice des Dieux • Fol Épi • Saint Agur • Vieux Pané • Saint Albray • Chaumes • Natais
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
