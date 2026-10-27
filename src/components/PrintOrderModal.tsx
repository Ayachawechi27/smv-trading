import React, { useRef } from 'react';
import { X, Printer, Phone, Mail, Upload, Image as ImageIcon, Stamp, Trash2, CheckCircle2 } from 'lucide-react';
import { SMVCartItem, CustomerOrderInfo } from '../types/ecommerce';
import { formatDT, COMMERCIAL_PHONE_DISPLAY, COMMERCIAL_EMAIL } from '../utils/formatters';

interface PrintOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SMVCartItem[];
  customerInfo: CustomerOrderInfo;
  onCustomerInfoChange?: (info: CustomerOrderInfo) => void;
}

export const PrintOrderModal: React.FC<PrintOrderModalProps> = ({
  isOpen,
  onClose,
  items,
  customerInfo,
  onCustomerInfoChange,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

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

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onCustomerInfoChange) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onCustomerInfoChange({
          ...customerInfo,
          clientLogoUrl: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Stamp Upload
  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onCustomerInfoChange) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onCustomerInfoChange({
          ...customerInfo,
          clientStampUrl: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    if (onCustomerInfoChange) {
      onCustomerInfoChange({
        ...customerInfo,
        clientLogoUrl: undefined,
      });
    }
  };

  const handleRemoveStamp = () => {
    if (onCustomerInfoChange) {
      onCustomerInfoChange({
        ...customerInfo,
        clientStampUrl: undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls Bar (Hidden on print) */}
        <div className="print:hidden p-4 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm sm:text-base">Bon de Commande Officiel B2B · Export PDF & Impression</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Ajoutez votre logo et votre cachet d'entreprise avant d'imprimer ou d'enregistrer en PDF.
            </p>
          </div>

          {/* Action buttons & file inputs */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Hidden file inputs */}
            <input
              type="file"
              ref={logoInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={stampInputRef}
              onChange={handleStampUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Logo upload button */}
            <button
              onClick={() => logoInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Ajouter ou modifier le logo de votre entreprise"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>{customerInfo.clientLogoUrl ? 'Changer Logo' : '+ Votre Logo'}</span>
            </button>

            {/* Stamp upload button */}
            <button
              onClick={() => stampInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Ajouter ou modifier le cachet numérique de votre entreprise"
            >
              <Stamp className="w-3.5 h-3.5 text-amber-400" />
              <span>{customerInfo.clientStampUrl ? 'Changer Cachet' : '+ Votre Cachet'}</span>
            </button>

            {/* Print / Save to PDF Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet (Standard A4 layout) */}
        <div className="p-6 sm:p-10 space-y-6 text-slate-900 bg-white max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0" id="printable-order">
          
          {/* Top Double-Header: SMV Trading on Left & Client Company on Right */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
            
            {/* Left: SMV Trading Supplier Info */}
            <div className="flex items-start gap-4">
              <img
                src="/products/catalog/smv_trading_logo.png"
                alt="SMV TRADING"
                className="h-16 w-auto object-contain shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 block">
                  Fournisseur / Grossiste
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                  SMV TRADING
                </h1>
                <p className="text-xs text-slate-600 font-medium">Distribution & Importation Agroalimentaire</p>
                <div className="text-[11px] text-slate-500 space-y-0.5 pt-0.5">
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

            {/* Right: Client Company Logo & Info */}
            <div className="sm:text-right flex flex-col sm:items-end space-y-1">
              
              {/* Client Logo if uploaded */}
              {customerInfo.clientLogoUrl ? (
                <div className="relative group inline-block mb-1">
                  <img
                    src={customerInfo.clientLogoUrl}
                    alt="Logo Client"
                    className="max-h-14 max-w-44 object-contain sm:ml-auto"
                  />
                  <button
                    onClick={handleRemoveLogo}
                    className="print:hidden absolute -top-1 -right-2 p-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Supprimer mon logo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="print:hidden text-[10px] text-blue-700 hover:underline flex items-center gap-1 sm:ml-auto mb-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>+ Cliquez pour insérer votre logo</span>
                </button>
              )}

              <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block">
                BON DE COMMANDE CLIENT
              </span>
              <p className="text-sm font-mono font-bold text-slate-900">
                N° CMD-{Math.floor(10000 + Math.random() * 90000)}
              </p>
              <p className="text-xs text-slate-500">Date d'émission : {today}</p>
            </div>

          </div>

          {/* Client Coordinates & Delivery Zone Details */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Établissement Émetteur / Client :
              </span>
              <p className="text-sm font-bold text-slate-900">
                {customerInfo.companyName ? customerInfo.companyName : customerInfo.clientName || 'Client'}
              </p>
              {customerInfo.companyName && customerInfo.clientName && (
                <p className="text-slate-700">Responsable : <strong>{customerInfo.clientName}</strong></p>
              )}
              <p className="text-slate-700">Tél : <strong>{customerInfo.clientPhone || 'Non renseigné'}</strong></p>
              {customerInfo.clientEmail && (
                <p className="text-slate-600">Email : {customerInfo.clientEmail}</p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Lieu & Modalités de Livraison :
              </span>
              <p className="text-sm font-bold text-emerald-800">
                Zone : {customerInfo.deliveryZone || 'Djerba'}
              </p>
              {customerInfo.address && (
                <p className="text-slate-700">Adresse : {customerInfo.address}</p>
              )}
              {customerInfo.notes && (
                <p className="text-slate-500 text-[11px] italic">Instructions : {customerInfo.notes}</p>
              )}
            </div>
          </div>

          {/* Items Table (Clean, without DLC, as requested) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-800 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-2.5 w-10 text-center">N°</th>
                  <th className="p-2.5 w-20">Code</th>
                  <th className="p-2.5">Désignation de l'article</th>
                  <th className="p-2.5">Fournisseur</th>
                  <th className="p-2.5">Conditionnement</th>
                  <th className="p-2.5 text-center">Quantité</th>
                  <th className="p-2.5 text-right">Prix Unitaire</th>
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
            </table>
          </div>

          {/* Financial Summary */}
          <div className="flex justify-end pt-1">
            <div className="w-80 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Nombre total de références :</span>
                <span className="font-mono font-bold">{items.length} article(s)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Unités totales commandées :</span>
                <span className="font-mono font-bold">{items.reduce((a, b) => a + b.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Total indicatif de la commande :</span>
                <span className="font-mono text-emerald-800 text-lg">{formatDT(total)}</span>
              </div>
            </div>
          </div>

          {/* Official Stamp & Signature Area (Where client puts their stamp & logo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            
            {/* Left box: Commercial notes */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 text-xs space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider block">
                  Engagement & Modalités Commerciales
                </span>
                <ul className="text-[11px] text-slate-600 list-disc list-inside mt-2 space-y-1 leading-relaxed">
                  <li>Commande transmise directement au service commercial SMV Trading.</li>
                  <li>Prix établis selon le barème officiel du catalogue SMV en vigueur.</li>
                  <li>Transport et livraison sous température contrôlée (chaîne du froid garantie).</li>
                </ul>
              </div>
              <p className="text-[10px] text-slate-400 italic pt-2 border-t border-slate-200">
                Fournisseurs officiels : Paysan Breton, Zanetti, Entremont, Soignon, Bastides, Volys Star, Jean Caby.
              </p>
            </div>

            {/* Right box: Client Stamp & Signature Box */}
            <div className="border-2 border-dashed border-slate-400 rounded-xl p-4 min-h-[170px] flex flex-col justify-between bg-white relative">
              
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-800 tracking-wider block">
                    Cadre Réservé au Cachet & Signature Client
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {customerInfo.companyName || customerInfo.clientName} · Zone : {customerInfo.deliveryZone || 'Djerba'}
                  </p>
                </div>

                {!customerInfo.clientStampUrl && (
                  <button
                    onClick={() => stampInputRef.current?.click()}
                    className="print:hidden text-[10px] text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    + Insérer cachet
                  </button>
                )}
              </div>

              {/* Render uploaded stamp image or dashed area */}
              {customerInfo.clientStampUrl ? (
                <div className="flex items-center justify-center my-2 relative group">
                  <img
                    src={customerInfo.clientStampUrl}
                    alt="Cachet d'entreprise client"
                    className="max-h-24 max-w-full object-contain"
                  />
                  <button
                    onClick={handleRemoveStamp}
                    className="print:hidden absolute top-0 right-0 p-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Supprimer le cachet"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 text-xs italic">
                  [ Apposer ici le Cachet de l'établissement et la Signature ]
                </div>
              )}

              <div className="flex justify-between items-end text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Date : {today}</span>
                <span className="font-semibold text-slate-700">Mention : "Bon pour commande"</span>
              </div>

            </div>

          </div>

          {/* Official Footer */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center space-y-0.5">
            <p>SMV TRADING · Tél Commercial : +216 {COMMERCIAL_PHONE_DISPLAY} · Email : {COMMERCIAL_EMAIL}</p>
            <p>Document généré depuis le catalogue officiel des prix SMV Trading</p>
          </div>

        </div>

      </div>
    </div>
  );
};
