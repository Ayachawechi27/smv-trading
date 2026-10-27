import React, { useState, useMemo } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MessageSquare, 
  Phone, 
  Copy, 
  Check, 
  Printer, 
  Mail,
  User,
  FileText,
  Building2,
  Send,
  ExternalLink,
  Facebook,
  Download,
  FileCheck
} from 'lucide-react';
import { SMVCartItem, CustomerOrderInfo } from '../types/ecommerce';
import { generateOrderPDF } from '../utils/generateOrderPdf';
import { 
  formatDT, 
  generateCommercialMessage, 
  COMMERCIAL_PHONE_INTL, 
  COMMERCIAL_PHONE_DISPLAY, 
  COMMERCIAL_EMAIL,
  COMMERCIAL_FACEBOOK_URL,
  getMailtoUrl
} from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  items: SMVCartItem[];
  customerInfo: CustomerOrderInfo;
  onCustomerInfoChange: (info: CustomerOrderInfo) => void;
  onClose: () => void;
  onUpdateQuantity: (code: string, newQty: number) => void;
  onRemoveItem: (code: string) => void;
  onClearCart: () => void;
  onPrintOrder: () => void;
  onOpenEmailModal: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  customerInfo,
  onCustomerInfoChange,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPrintOrder,
  onOpenEmailModal,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const handleDownloadPDF = () => {
    generateOrderPDF({ items, customerInfo });
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 3000);
  };

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const commercialMessage = useMemo(() => {
    return generateCommercialMessage(items, customerInfo);
  }, [items, customerInfo]);

  const handleInputChange = (field: keyof CustomerOrderInfo, value: string) => {
    onCustomerInfoChange({
      ...customerInfo,
      [field]: value,
    });
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(commercialMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const whatsappUrl = `https://wa.me/${COMMERCIAL_PHONE_INTL}?text=${encodeURIComponent(commercialMessage)}`;
  const smsUrl = `sms:+${COMMERCIAL_PHONE_INTL}?body=${encodeURIComponent(commercialMessage)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 text-white rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Bon de Commande ({items.reduce((acc, i) => acc + i.quantity, 0)} articles)
              </h2>
              <p className="text-xs text-slate-500">
                Transmission au commercial par WhatsApp ou Email (<strong className="text-slate-700">{COMMERCIAL_EMAIL}</strong>)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="p-4 rounded-full bg-slate-100 text-slate-400">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Votre panier de commande est vide</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Sélectionnez vos fromages et charcuteries dans le catalogue pour composer votre commande.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer"
              >
                Parcourir le catalogue
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-slate-700">
                    Articles sélectionnés
                  </h3>
                  <button
                    onClick={onClearCart}
                    className="text-[11px] text-red-600 hover:underline cursor-pointer"
                  >
                    Vider le panier
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
                  {items.map((item) => {
                    const lineTotal = item.product.price * item.quantity;
                    return (
                      <div key={item.product.code} className="p-3 flex items-start gap-3 text-xs">
                        {/* Thumbnail */}
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-lg object-contain bg-slate-50 border border-slate-100 shrink-0 p-1"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold font-mono text-[11px] text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                              #{item.product.code}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {item.product.brand}
                            </span>
                          </div>

                          <p className="font-semibold text-slate-800 truncate" title={item.product.name}>
                            {item.product.name}
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                            <span>{formatDT(item.product.price)} / {item.product.isPerKg ? 'kg' : 'pcs'}</span>
                            <span className="font-bold font-mono text-slate-900">
                              Total : {formatDT(lineTotal)}
                            </span>
                          </div>

                          {/* Stepper & Delete */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center border border-slate-200 rounded bg-slate-50">
                              <button
                                onClick={() => onUpdateQuantity(item.product.code, item.quantity - 1)}
                                className="px-2 py-0.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  onUpdateQuantity(item.product.code, isNaN(val) || val < 1 ? 1 : val);
                                }}
                                className="w-16 text-center text-xs font-mono font-bold text-slate-900 bg-transparent border-none outline-none"
                              />
                              <button
                                onClick={() => onUpdateQuantity(item.product.code, item.quantity + 1)}
                                className="px-2 py-0.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.product.code)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1"
                              title="Retirer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Delivery Information Form */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Coordonnées du Client & Facturation</span>
                  </h3>
                  <span className="text-[10px] text-slate-500">Pour le bon de commande</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Nom du Client / Responsable *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: aya"
                      value={customerInfo.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Téléphone Portable *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="ex: 12457482"
                      value={customerInfo.clientPhone}
                      onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email client field */}
                <div className="text-xs">
                  <label className="block text-slate-700 font-medium mb-1">
                    Email Professionnel du Client (pour confirmation / devis)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="ex: aya.contact@entreprise.tn"
                      value={customerInfo.clientEmail || ''}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 p-2 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Zone de livraison *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: djerba, Tunis, Sousse, Sfax..."
                      value={customerInfo.deliveryZone}
                      onChange={(e) => handleInputChange('deliveryZone', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Société / Enseigne (optionnel)
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Hôtel, Épicerie, Restaurant..."
                      value={customerInfo.companyName || ''}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Adresse précise ou instructions de livraison (optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Rue Habib Bourguiba, Midoun, Djerba..."
                    value={customerInfo.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Exact Commercial Message Preview Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aperçu du texte transmis au Commercial :</span>
                  </span>
                  <button
                    onClick={handleCopyMessage}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copier le texte</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner max-h-44 overflow-y-auto">
                  {commercialMessage}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Drawer Footer with Actions */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            
            {/* Total Row */}
            <div className="flex items-center justify-between text-slate-900 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-500 block">Total indicatif :</span>
                <span className="text-[11px] text-slate-400">Prix catalogue selon barème officiel SMV</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-800">
                {formatDT(total)}
              </span>
            </div>

            {/* Main Professional Transmission Actions */}
            <div className="space-y-2 pt-1">
              
              {/* DIRECT PDF DOWNLOAD BUTTON */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="w-full py-3 px-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
                title="Télécharger directement le bon de commande officiel au format PDF"
              >
                {pdfDownloaded ? (
                  <>
                    <FileCheck className="w-4 h-4 text-emerald-300" />
                    <span>Bon de commande PDF téléchargé !</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-emerald-300" />
                    <span>Télécharger le Bon de Commande (PDF)</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* WhatsApp Action Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Envoyer sur WhatsApp</span>
                </a>

                {/* Professional Email Action Button */}
                <button
                  type="button"
                  onClick={onOpenEmailModal}
                  className="py-2.5 px-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-center"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Envoyer par Email</span>
                </button>
              </div>

              {/* Secondary Row: SMS & Customize Logo/Stamp */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={smsUrl}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Envoyer par SMS</span>
                </a>

                <button
                  onClick={onPrintOrder}
                  className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  title="Ajouter votre logo, cachet d'entreprise et imprimer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cachet & Logo / Imprimer</span>
                </button>
              </div>

            </div>

            {/* Email & Facebook destination reminder */}
            <div className="pt-2 text-[11px] text-center text-slate-500 border-t border-slate-200/80 space-y-1">
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <span>Email commercial officiel :</span>
                <a
                  href={`mailto:${COMMERCIAL_EMAIL}`}
                  className="font-bold text-blue-700 hover:underline font-mono"
                >
                  {COMMERCIAL_EMAIL}
                </a>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-slate-500">
                <span>Page officielle :</span>
                <a
                  href={COMMERCIAL_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                >
                  <Facebook className="w-3 h-3 fill-current" />
                  <span>SMV Trading sur Facebook</span>
                </a>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
