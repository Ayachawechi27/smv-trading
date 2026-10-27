import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Tag, 
  X, 
  ArrowRight, 
  Bell, 
  Flame, 
  ChevronRight,
  TrendingUp,
  Percent
} from 'lucide-react';

interface WelcomeNoveltyBannerProps {
  onExplorePromotions: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

export const WelcomeNoveltyBanner: React.FC<WelcomeNoveltyBannerProps> = ({
  onExplorePromotions,
  onOpenNotifications,
  unreadCount,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in session
    const dismissed = sessionStorage.getItem('smv_welcome_dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('smv_welcome_dismissed', 'true');
  };

  const handleReopen = () => {
    setIsVisible(true);
    setIsDismissed(false);
  };

  if (isDismissed && !isVisible) {
    // Floating compact quick-badge so client can always re-trigger it
    return (
      <div className="fixed bottom-5 left-5 z-30 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <button
          onClick={handleReopen}
          className="flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg text-xs font-bold transition-all cursor-pointer group"
          title="Consulter les offres et arrivages"
        >
          <Flame className="w-4 h-4 text-amber-200 animate-pulse" />
          <span>Offres & Nouveautés</span>
          <span className="w-5 h-5 rounded-full bg-white text-amber-800 text-[11px] font-mono font-black flex items-center justify-center">
            {unreadCount > 0 ? unreadCount : '!'}
          </span>
        </button>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-md border-b border-amber-500/50 z-30 animate-in slide-in-from-top duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Main Headline & Tags */}
          <div className="flex items-center gap-3 text-center md:text-left flex-wrap justify-center md:justify-start">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-amber-900 rounded-full font-black text-[11px] uppercase tracking-wider shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-current animate-pulse" />
              <span>Nouveaux Arrivages Frais</span>
            </span>

            <p className="font-medium text-amber-50 text-xs sm:text-sm">
              <strong className="text-white font-bold">Arrivage direct Europe :</strong> Réception de containers d'Italie et de France (Zanetti, Paysan Breton, Entremont, Volys Star). DLC optimale et traçabilité certifiée.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                onExplorePromotions();
                handleDismiss();
              }}
              className="px-3.5 py-1.5 bg-white hover:bg-amber-50 text-amber-950 font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer text-xs group"
            >
              <span>Découvrir les Arrivages</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-800 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenNotifications}
              className="px-3 py-1.5 bg-black/20 hover:bg-black/30 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              title="Ouvrir toutes les notifications"
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Alertes ({unreadCount})</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1.5 text-amber-200 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              aria-label="Fermer le bandeau d'information"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
