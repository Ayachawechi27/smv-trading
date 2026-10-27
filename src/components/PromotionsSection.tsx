import React, { useState } from 'react';
import { 
  Sparkles, 
  Tag, 
  Clock, 
  TrendingUp, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Check, 
  Percent, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Box
} from 'lucide-react';
import { SMVProduct } from '../types/ecommerce';
import { formatDT } from '../utils/formatters';

interface PromotionsSectionProps {
  products: SMVProduct[];
  onAddToCart: (product: SMVProduct, quantity: number) => void;
  cart: { product: SMVProduct; quantity: number }[];
  onExploreFullCatalog: () => void;
}

type PromoFilterType = 'all' | 'promos' | 'arrivals' | 'fromages' | 'charcuterie';

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  products,
  onAddToCart,
  cart,
  onExploreFullCatalog,
}) => {
  const [activeFilter, setActiveFilter] = useState<PromoFilterType>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedSuccessCode, setAddedSuccessCode] = useState<string | null>(null);

  // Filter products according to selected tab and prioritize promotional items
  const displayedItems = products
    .filter((item) => {
      if (activeFilter === 'promos') return item.isPromo;
      if (activeFilter === 'arrivals') return item.isNewArrival;
      if (activeFilter === 'fromages') return item.category.toLowerCase().includes('fromage');
      if (activeFilter === 'charcuterie') return item.category.toLowerCase().includes('charcuterie');
      return true; // 'all'
    })
    .sort((a, b) => {
      if (a.isPromo && !b.isPromo) return -1;
      if (!a.isPromo && b.isPromo) return 1;
      return 0;
    });

  const getQty = (code: string) => quantities[code] || 1;

  const handleQtyChange = (code: string, delta: number) => {
    const current = getQty(code);
    const next = Math.max(1, current + delta);
    setQuantities((prev) => ({ ...prev, [code]: next }));
  };

  const handleAdd = (product: SMVProduct) => {
    const qty = getQty(product.code);
    onAddToCart(product, qty);
    setAddedSuccessCode(product.code);
    setTimeout(() => {
      setAddedSuccessCode(null);
    }, 1200);
  };

  return (
    <section id="promotions-section" className="relative bg-gradient-to-b from-amber-50/50 via-white to-slate-50 border-y border-amber-200/50 py-12 lg:py-16 overflow-hidden">
      
      {/* Decorative background ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header with Refined Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300/80 rounded-full text-amber-900 text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
              <span>Espace Nouveautés & Arrivages Directs</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Nouveautés & Nouveaux Arrivages Frais
            </h2>
            
            <p className="text-sm text-slate-600 leading-relaxed">
              Découvrez notre sélection de nouveautés et arrivages récents en direct d'Europe : fromages d'exception et charcuteries de prestige, 
              directement importés avec traçabilité et DLC garanties.
            </p>
          </div>

          {/* Quick jump to full catalog */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={onExploreFullCatalog}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer group"
            >
              <span>Consulter tout le catalogue (161 réf.)</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Toutes les Nouveautés ({products.length})
          </button>

          {products.some((p) => p.isPromo) && (
            <button
              onClick={() => setActiveFilter('promos')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFilter === 'promos'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Remises & Promotions</span>
            </button>
          )}

          <button
            onClick={() => setActiveFilter('arrivals')}
            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'arrivals'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Nouveaux Arrivages Frais</span>
          </button>

          <button
            onClick={() => setActiveFilter('fromages')}
            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'fromages'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Fromages en Vedette
          </button>

          <button
            onClick={() => setActiveFilter('charcuterie')}
            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'charcuterie'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Charcuteries en Offre
          </button>
        </div>

        {/* Promo Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedItems.map((product) => {
            const inCart = cart.find((item) => item.product.code === product.code);
            const qty = getQty(product.code);
            const isSuccess = addedSuccessCode === product.code;

            // Calculate saving amount if discounted
            const savings = product.originalPrice ? product.originalPrice - product.price : 0;

            return (
              <div
                key={`promo-${product.code}`}
                className="group relative bg-white rounded-2xl border border-amber-200/80 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Badge Ribbon */}
                <div className="relative aspect-4/3 w-full bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Corner Discount Pill or Arrival Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    {product.isPromo && product.discountPercent ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 text-white text-xs font-black rounded-lg shadow-sm">
                        <Tag className="w-3 h-3" />
                        <span>-{product.discountPercent}% REMISE</span>
                      </span>
                    ) : product.isNewArrival ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm">
                        <Sparkles className="w-3 h-3 text-emerald-300" />
                        <span>{product.arrivalBadge || 'Nouvel Arrivage'}</span>
                      </span>
                    ) : null}

                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-900/85 text-white font-mono text-[10px] font-bold">
                      #{product.code}
                    </span>
                  </div>

                  {/* Brand tag top-right */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/95 border border-slate-200 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded shadow-2xs">
                      {product.brand}
                    </span>
                  </div>

                  {/* In Cart Indicator */}
                  {inCart && (
                    <div className="absolute bottom-2.5 right-3">
                      <span className="bg-emerald-700 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Dans le panier : {inCart.quantity}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Validity */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span className="text-emerald-800 font-semibold uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.promoValidUntil && (
                        <span className="text-amber-800 flex items-center gap-1 text-[10px] font-medium">
                          <Clock className="w-3 h-3" />
                          <span>Jusqu’au {product.promoValidUntil}</span>
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-bold text-slate-900 text-sm mt-1 leading-snug line-clamp-2" title={product.name}>
                      {product.name}
                    </h3>

                    {/* Promo Highlight sentence */}
                    {product.promoDescription && (
                      <p className="text-[11px] text-amber-900 font-medium bg-amber-50/90 border border-amber-200/80 rounded-md p-1.5 mt-2">
                        {product.promoDescription}
                      </p>
                    )}

                    {/* Specs: DLC & Packing */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2.5">
                      <div className="flex items-center gap-1 truncate" title={product.dlc}>
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{product.dlc}</span>
                      </div>
                      <div className="flex items-center gap-1 truncate" title={product.packing}>
                        <Box className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{product.packing}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Add to Order Bar */}
                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    
                    <div className="flex items-baseline justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {product.isPromo && product.originalPriceFormatted ? 'Tarif préférentiel :' : 'Prix unitaire catalogue :'}
                        </span>
                        {product.isPromo && product.originalPriceFormatted && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400 line-through font-mono">
                              {product.originalPriceFormatted}
                            </span>
                            {savings > 0 && (
                              <span className="text-[10px] text-emerald-700 font-semibold">
                                (-{formatDT(savings)})
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-extrabold font-mono text-emerald-800 tabular-nums">
                          {formatDT(product.price)}
                        </span>
                        {product.isPerKg && (
                          <span className="text-[10px] text-slate-500 block">le kg</span>
                        )}
                      </div>
                    </div>

                    {/* Stepper + Add CTA */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 p-0.5 shrink-0">
                        <button
                          onClick={() => handleQtyChange(product.code, -1)}
                          className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-slate-900">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleQtyChange(product.code, 1)}
                          className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleAdd(product)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          isSuccess
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                      >
                        {isSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Ajouté au bon !</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Commander l'offre</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Reassurance Footer Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Engagement Qualité & DLC Respectées</p>
              <p className="text-slate-500 text-[11px]">Tous nos produits en promotion disposent d’une durée de conservation optimale conforme aux fiches usines.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-700">Besoin d'un tarif palette ou demi-gros ?</span>
            <button
              onClick={onExploreFullCatalog}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
            >
              Voir Tout le Catalogue
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
