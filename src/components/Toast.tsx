import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info';
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-neutral-900 text-white rounded-xl p-4 shadow-xl border border-neutral-700 animate-in slide-in-from-bottom duration-200 flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold">{toast.title}</p>
        {toast.description && (
          <p className="text-[11px] text-neutral-300 mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-neutral-400 hover:text-white transition-colors p-1"
        aria-label="Fermer la notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
