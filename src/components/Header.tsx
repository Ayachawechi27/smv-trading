import React, { useState } from 'react';
import { ShoppingCart, Phone, MessageSquare, Search, Menu, X, FileText, Mail } from 'lucide-react';
import { COMMERCIAL_PHONE_DISPLAY, COMMERCIAL_PHONE_INTL, COMMERCIAL_EMAIL } from '../utils/formatters';

interface HeaderProps {
  cartCount: number;
  cartTotalFormatted: string;
  onOpenCart: () => void;
  onSelectCategory: (cat: string) => void;
  activeCategory: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenPdfModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotalFormatted,
  onOpenCart,
  onSelectCategory,
  activeCategory,
  searchQuery,
  onSearchChange,
  onOpenPdfModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top corporate notice & direct contacts bar */}
      <aside aria-label="Informations commerciales" className="bg-[#0f172a] text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs font-medium">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-400">SMV TRADING</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Grossiste & Importateur Agroalimentaire</span>
            <span className="hidden md:inline text-slate-500">·</span>
            <span className="hidden md:inline text-slate-400">Catalogue des Prix Officiel</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:+${COMMERCIAL_PHONE_INTL}`}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Commercial : <strong className="text-white">{COMMERCIAL_PHONE_DISPLAY}</strong></span>
            </a>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <a
              href={`mailto:${COMMERCIAL_EMAIL}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              title="Envoyer un email au service commercial"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{COMMERCIAL_EMAIL}</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="/" className="flex items-center gap-2.5 group">
              <img
                src="/products/catalog/smv_trading_logo.png"
                alt="Logo SMV TRADING"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  SMV TRADING
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                  Catalogue & Prise de Commande
                </span>
              </div>
            </a>
          </div>

          {/* Central Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher un code (ex: 7016, 7025), produit ou marque..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* View Original PDF button */}
            <button
              onClick={onOpenPdfModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Consulter le catalogue PDF original"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>PDF Original</span>
            </button>

            {/* Direct WhatsApp Callout */}
            <a
              href={`https://wa.me/${COMMERCIAL_PHONE_INTL}?text=${encodeURIComponent('Bonjour SMV Trading, je souhaite avoir des informations sur votre catalogue.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              title="Discuter directement sur WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm transition-all cursor-pointer font-medium text-xs whitespace-nowrap"
              aria-label="Voir le bon de commande / panier"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Panier Commande</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums font-bold">
                {cartCount}
              </span>
              {cartCount > 0 && (
                <span className="hidden xl:inline text-[11px] font-mono tabular-nums text-emerald-100 border-l border-white/20 pl-2">
                  {cartTotalFormatted}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search & Categories Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Code (7016, 7025...), produit, marque..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {['Toutes', 'Fromages', 'Charcuterie Halal', 'Charcuterie de Porc'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded text-left font-medium transition-colors ${
                    activeCategory === cat ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <button
                onClick={() => {
                  onOpenPdfModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-emerald-700 font-semibold"
              >
                <FileText className="w-4 h-4" />
                <span>Télécharger le PDF Original</span>
              </button>
              <a
                href={`tel:+${COMMERCIAL_PHONE_INTL}`}
                className="flex items-center gap-1 text-slate-900 font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{COMMERCIAL_PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
