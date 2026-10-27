import React from 'react';
import { X, Printer, Phone, Mail } from 'lucide-react';
import { SMVCartItem, CustomerOrderInfo } from '../types/ecommerce';
import { formatDT, COMMERCIAL_PHONE_DISPLAY, COMMERCIAL_EMAIL } from '../utils/formatters';

interface PrintOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SMVCartItem[];
  customerInfo: CustomerOrderInfo;
}

export const PrintOrderModal: React.FC<PrintOrderModalProps> = ({
  isOpen,
  onClose,
  items,
  customerInfo,
}) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in print) */}
        <div className="print:hidden p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Bon de Commande Officiel · Prêt à imprimer</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Order Sheet */}
        <div className="p-8 space-y-6 text-slate-900 bg-white" id="printable-order">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div className="flex items-center gap-4">
              <img
                src="/products/catalog/smv_trading_logo.png"
                alt="SMV TRADING"
                className="h-16 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">SMV TRADING</h1>
                <p className="text-xs text-slate-600 font-medium">Distribution & Importation Agroalimentaire</p>
                <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                  <p className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-700" />
                    <span>Tél Commercial : <strong>+216 {COMMERCIAL_PHONE_DISPLAY}</strong></span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-700" />
                    <span>Email : {COMMERCIAL_EMAIL}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block">
                Bon de Commande Client
              </span>
              <p className="text-sm font-mono font-bold text-slate-900 mt-1">
                N° CMD-{Math.floor(10000 + Math.random() * 90000)}
              </p>
              <p className="text-xs text-slate-500">Date : {today}</p>
            </div>
          </div>

          {/* Client Info Grid */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Destinataire / Client :</span>
              <p className="text-base font-bold text-slate-900">{customerInfo.clientName || 'Client'}</p>
              {customerInfo.companyName && (
                <p className="text-slate-700 font-semibold">{customerInfo.companyName}</p>
              )}
              <p className="text-slate-700">Tél : <strong>{customerInfo.clientPhone || 'Non renseigné'}</strong></p>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Zone de livraison :</span>
              <p className="text-base font-bold text-emerald-800">{customerInfo.deliveryZone || 'Djerba'}</p>
              {customerInfo.address && (
                <p className="text-slate-600">{customerInfo.address}</p>
              )}
              {customerInfo.notes && (
                <p className="text-slate-500 text-[11px] italic mt-1">Remarques : {customerInfo.notes}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Code</th>
                  <th className="p-2.5">Désignation</th>
                  <th className="p-2.5">Fournisseur</th>
                  <th className="p-2.5">Conditionnement</th>
                  <th className="p-2.5 text-center">Quantité</th>
                  <th className="p-2.5 text-right">Prix Unitaire</th>
                  <th className="p-2.5 text-right">Total Ligne</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.product.code} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono font-bold text-slate-900">#{item.product.code}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{item.product.name}</td>
                    <td className="p-2.5 text-slate-600">{item.product.brand}</td>
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
            </table>
          </div>

          {/* Summary / Total Indicatif */}
          <div className="flex justify-end pt-2">
            <div className="w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Nombre d'articles :</span>
                <span className="font-mono font-bold">{items.reduce((a, b) => a + b.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Total indicatif :</span>
                <span className="font-mono text-emerald-800 text-lg">{formatDT(total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 text-center space-y-1">
            <p>Ce bon de commande est transmis directement au service commercial SMV Trading pour confirmation et ordonnancement de la livraison.</p>
            <p>SMV TRADING · Tél: +216 {COMMERCIAL_PHONE_DISPLAY} · Email: {COMMERCIAL_EMAIL}</p>
          </div>

        </div>

      </div>
    </div>
  );
};
