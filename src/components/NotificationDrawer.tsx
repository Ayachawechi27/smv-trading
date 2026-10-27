import React from 'react';
import { 
  Bell, 
  X, 
  Sparkles, 
  Tag, 
  CheckCheck, 
  Clock, 
  ArrowRight,
  Volume2,
  ShieldAlert,
  Check
} from 'lucide-react';
import { NoveltyNotification } from '../types/ecommerce';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NoveltyNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectProductNotification: (productCode: string) => void;
  browserNotificationsEnabled: boolean;
  onRequestBrowserNotifications: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectProductNotification,
  browserNotificationsEnabled,
  onRequestBrowserNotifications,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Centre des Nouveautés & Alertes</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-xs font-mono font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Nouveaux arrivages frais, nouveautés et informations directes SMV
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Push Notifications Opt-In Notice */}
        <div className="bg-amber-50 border-b border-amber-200/80 p-3.5 px-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-amber-900">
            <Volume2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Alertes Nouveaux Arrivages</p>
              <p className="text-[11px] text-amber-800">
                {browserNotificationsEnabled
                  ? 'Vous recevrez les alertes de nouveaux stocks en temps réel.'
                  : 'Soyez notifié dès qu’un arrivage ou une promotion est disponible.'}
              </p>
            </div>
          </div>

          {browserNotificationsEnabled ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md shrink-0">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Actives</span>
            </span>
          ) : (
            <button
              onClick={onRequestBrowserNotifications}
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition-colors shrink-0 shadow-2xs cursor-pointer"
            >
              Activer
            </button>
          )}
        </div>

        {/* Toolbar: Actions */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{notifications.length} notifications enregistrées</span>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 text-slate-700 hover:text-slate-950 font-semibold cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tout marquer comme lu</span>
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Aucune notification pour le moment.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 ${
                  notif.isRead
                    ? 'bg-white border-slate-200 text-slate-700 opacity-85'
                    : 'bg-amber-50/40 border-amber-300 shadow-2xs text-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {notif.type === 'promo' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-black uppercase">
                        <Tag className="w-2.5 h-2.5" />
                        <span>{notif.discountBadge || 'Promotion'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold uppercase">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-300" />
                        <span>{notif.discountBadge || 'Arrivage Frais'}</span>
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{notif.date}</span>
                    </span>
                  </div>

                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {notif.title}
                </h3>

                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {notif.description}
                </p>

                {/* Direct Action if productCode is linked */}
                {notif.productCode && (
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notif.id);
                        onSelectProductNotification(notif.productCode!);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold text-xs cursor-pointer group"
                    >
                      <span>Voir l'article (#{notif.productCode})</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Ref #{notif.productCode}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">Service Commercial SMV Trading</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
