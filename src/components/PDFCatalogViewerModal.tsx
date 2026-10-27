import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';

interface PDFCatalogViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

export const PDFCatalogViewerModal: React.FC<PDFCatalogViewerModalProps> = ({
  isOpen,
  onClose,
  initialPage = 1,
}) => {
  if (!isOpen) return null;

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const totalPages = 34;

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const pageStr = `${currentPage}`.padStart(2, '0');
  const pageImgUrl = `/pages/page_${pageStr}.jpg`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="p-3 sm:p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Catalogue Officiel des Prix · SMV Trading
              </h3>
              <p className="text-[11px] text-slate-400">
                Document original 34 pages · MAJ Septembre 2025/2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/assets/aistudio/LISTE_DES_PRIX_SMV_TRADING_30-04-2026_1adf8611.pdf"
              download="LISTE_DES_PRIX_SMV_TRADING.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Télécharger PDF</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page Navigation Strip */}
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 cursor-pointer font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Page Précédente</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Page {currentPage} / {totalPages}</span>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <option key={pg} value={pg}>
                  Page {pg}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 cursor-pointer font-medium"
          >
            <span>Page Suivante</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Page Display Stage */}
        <div className="flex-1 overflow-y-auto bg-slate-200/80 p-4 flex justify-center">
          <div className="max-w-2xl w-full bg-white shadow-lg rounded border border-slate-300 overflow-hidden">
            <img
              src={pageImgUrl}
              alt={`Page ${currentPage} du catalogue SMV Trading`}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
