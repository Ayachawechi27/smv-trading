import React, { useState } from 'react';
import { ShoppingCart, Calendar, Box, Check, Plus, Minus } from 'lucide-react';
import { SMVProduct } from '../types/ecommerce';
import { formatDT } from '../utils/formatters';

interface ProductCardProps {
  product: SMVProduct;
  onAddToCart: (product: SMVProduct, quantity: number) => void;
  cartQuantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  cartQuantity,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    if (quantity <= 0) return;
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      
      <div>
        {/* Image Stage with Code & Brand Badges */}
        <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden border-b border-slate-100 flex items-center justify-center p-3">
          <img
            src={product.image}
            alt={`${product.code} - ${product.name}`}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // fallback image if missing
              const target = e.target as HTMLElement;
              target.style.display = 'none';
            }}
          />

          {/* Code Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center px-2 py-1 rounded bg-slate-900 text-white font-mono font-bold text-xs tracking-wider shadow-xs">
              #{product.code}
            </span>
            {product.isPromo && product.discountPercent && (
              <span className="inline-flex items-center px-2 py-1 rounded bg-amber-600 text-white font-mono font-extrabold text-xs tracking-tight shadow-xs animate-pulse">
                -{product.discountPercent}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-600 text-white font-bold text-xs tracking-tight shadow-xs">
                {product.arrivalBadge || 'Nouveauté'}
              </span>
            )}
          </div>

          {/* Brand Badge */}
          <div className="absolute top-2.5 right-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/95 border border-slate-200 text-slate-800 text-[11px] font-semibold tracking-wide shadow-2xs">
              {product.brand}
            </span>
          </div>

          {/* Per Kg indicator */}
          {product.isPerKg && (
            <div className="absolute bottom-2 left-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                Prix au Kg
              </span>
            </div>
          )}

          {/* Cart item presence indicator */}
          {cartQuantity > 0 && (
            <div className="absolute bottom-2 right-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[11px] font-bold font-mono">
                Dans le panier : {cartQuantity} {product.isPerKg ? 'kg' : 'pcs'}
              </span>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="p-4 space-y-2.5">
          
          {/* Category & Page reference in PDF */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="uppercase tracking-wider text-emerald-800 font-semibold">{product.category}</span>
            <span className="text-slate-400">Page {product.page} du catalogue</span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 min-h-10" title={product.name}>
            {product.name}
          </h3>

          {/* Promo or novelty description if any */}
          {product.promoDescription && (
            <p className="text-[11px] font-medium text-amber-800 bg-amber-50/80 px-2 py-1 rounded border border-amber-200/60 line-clamp-1">
              ✨ {product.promoDescription}
            </p>
          )}

          {/* DLC & Packaging specs */}
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 rounded-lg p-2 border border-slate-100 text-slate-600">
            <div className="flex items-center gap-1.5 truncate" title={product.dlc}>
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{product.dlc}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate" title={product.packing}>
              <Box className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{product.packing}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Pricing & Add to Cart Module */}
      <div className="p-4 pt-0 space-y-3">
        
        {/* Price Row */}
        <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Tarif unitaire :</span>
            {product.isPromo && product.originalPriceFormatted && (
              <span className="text-[11px] text-slate-400 line-through font-mono">
                {product.originalPriceFormatted}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className={`text-lg font-bold font-mono tabular-nums ${product.isPromo ? 'text-amber-700 font-extrabold' : 'text-slate-900'}`}>
              {formatDT(product.price)}
            </span>
            {product.isPerKg && (
              <span className="text-[10px] text-slate-500 block font-normal">le kilogramme</span>
            )}
          </div>
        </div>

        {/* Quantity Stepper & Add Button */}
        <div className="flex items-center gap-2">
          
          {/* Stepper with manual input support */}
          <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 p-1 shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
              aria-label="Diminuer quantité"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setQuantity(isNaN(val) || val < 1 ? 1 : val);
              }}
              className="w-12 text-center text-xs font-mono font-bold text-slate-900 bg-transparent border-none outline-none"
              aria-label="Quantité"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
              aria-label="Augmenter quantité"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to order CTA */}
          <button
            onClick={handleAdd}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Ajouté !</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Commander</span>
              </>
            )}
          </button>

        </div>

      </div>

    </article>
  );
};
