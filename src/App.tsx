/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PromotionsSection } from './components/PromotionsSection';
import { WelcomeNoveltyBanner } from './components/WelcomeNoveltyBanner';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { PDFCatalogViewerModal } from './components/PDFCatalogViewerModal';
import { PrintOrderModal } from './components/PrintOrderModal';
import { EmailOrderModal } from './components/EmailOrderModal';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { CompanyDescriptionSection } from './components/CompanyDescriptionSection';

import { SMVProduct, SMVCartItem, CustomerOrderInfo, NoveltyNotification } from './types/ecommerce';
import { formatDT, COMMERCIAL_PHONE_DISPLAY } from './utils/formatters';
import { ENRICHED_CATALOG, ACTIVE_PROMOTIONS_AND_ARRIVALS, INITIAL_NOTIFICATIONS } from './data/promotions';
import { 
  Filter, 
  Search, 
  RotateCcw, 
  FileText, 
  ArrowUpDown, 
  Sparkles,
  Percent,
  TrendingUp
} from 'lucide-react';

const CATALOG: SMVProduct[] = ENRICHED_CATALOG;

export default function App() {
  // Customer info initialized with user's example
  const [customerInfo, setCustomerInfo] = useState<CustomerOrderInfo>(() => {
    try {
      const saved = localStorage.getItem('smv_customer');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      clientName: 'aya',
      clientPhone: '12457482',
      deliveryZone: 'djerba',
      companyName: '',
      address: '',
      notes: '',
    };
  });

  // Cart initialized with the user's prompt example
  const [cart, setCart] = useState<SMVCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('smv_cart');
      if (saved) return JSON.parse(saved);
    } catch {}

    // Find 7016, 7025, 7048
    const item7016 = CATALOG.find((p) => p.code === '7016');
    const item7025 = CATALOG.find((p) => p.code === '7025');
    const item7048 = CATALOG.find((p) => p.code === '7048');

    const defaultItems: SMVCartItem[] = [];
    if (item7016) defaultItems.push({ product: item7016, quantity: 1 });
    if (item7025) defaultItems.push({ product: item7025, quantity: 8 });
    if (item7048) defaultItems.push({ product: item7048, quantity: 20110 });

    return defaultItems;
  });

  // Notifications system state
  const [notifications, setNotifications] = useState<NoveltyNotification[]>(() => {
    try {
      const saved = localStorage.getItem('smv_notifications');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission === 'granted';
    }
    return false;
  });

  // Navigation & Filtering
  const [activeCategory, setActiveCategory] = useState<string>('Toutes');
  const [selectedBrand, setSelectedBrand] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'catalog' | 'code' | 'price-asc' | 'price-desc' | 'name'>('catalog');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('smv_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('smv_customer', JSON.stringify(customerInfo));
  }, [customerInfo]);

  useEffect(() => {
    localStorage.setItem('smv_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Unique brands list
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    CATALOG.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }, []);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = [...CATALOG];

    // Category / Special filter
    if (activeCategory === 'Promotions') {
      list = list.filter((p) => p.isPromo);
    } else if (activeCategory === 'Nouveautés') {
      list = list.filter((p) => p.isNewArrival);
    } else if (activeCategory !== 'Toutes') {
      list = list.filter((p) => p.category.toLowerCase().includes(activeCategory.toLowerCase()));
    }

    // Brand filter
    if (selectedBrand !== 'Toutes') {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    // Search query (code, name, brand, dlc, packing)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.code.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.dlc.toLowerCase().includes(q) ||
          p.packing.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'code':
        list.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'catalog':
      default:
        list.sort((a, b) => a.page - b.page);
        break;
    }

    return list;
  }, [activeCategory, selectedBrand, searchQuery, sortBy]);

  // Cart operations
  const handleAddToCart = (product: SMVProduct, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.code === product.code);
      if (existing) {
        return prev.map((item) =>
          item.product.code === product.code
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    setToast({
      id: `${Date.now()}`,
      title: 'Article ajouté à la commande',
      description: `${product.code} - ${product.name} (x${quantity} ${product.isPerKg ? 'kg' : 'pcs'})`,
      type: 'success',
    });
  };

  const handleUpdateQuantity = (code: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(code);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.code === code ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (code: string) => {
    setCart((prev) => prev.filter((item) => item.product.code !== code));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Notification handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleSelectProductFromNotification = (productCode: string) => {
    const product = CATALOG.find((p) => p.code === productCode);
    if (product) {
      setSearchQuery(productCode);
      setActiveCategory('Toutes');
      setSelectedBrand('Toutes');
      scrollToCatalog();
      setToast({
        id: `${Date.now()}`,
        title: `Produit sélectionné : #${product.code}`,
        description: product.name,
        type: 'info',
      });
    }
  };

  const handleRequestBrowserNotifications = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setBrowserNotificationsEnabled(true);
          setToast({
            id: `${Date.now()}`,
            title: 'Notifications activées avec succès !',
            description: 'Vous recevrez directement les alertes de nouveaux arrivages et remises SMV Trading.',
            type: 'success',
          });
          try {
            new Notification('SMV Trading - Alertes Activées', {
              body: 'Vous recevrez les nouveautés et promotions fraîches en temps réel !',
              icon: '/products/catalog/smv_trading_logo.png',
            });
          } catch {}
        } else {
          setToast({
            id: `${Date.now()}`,
            title: 'Permission refusée',
            description: 'Vous pouvez activer les notifications dans les paramètres de votre navigateur.',
            type: 'info',
          });
        }
      });
    } else {
      setToast({
        id: `${Date.now()}`,
        title: 'Notifications non supportées',
        description: 'Votre navigateur actuel ne supporte pas les notifications push.',
        type: 'info',
      });
    }
  };

  // Cart total calculations
  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const totalCartAmount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const scrollToCatalog = () => {
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPromotions = () => {
    document.getElementById('promotions-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
      
      {/* Welcome Novelty Alert Banner on Site Opening */}
      <WelcomeNoveltyBanner
        onExplorePromotions={scrollToPromotions}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        unreadCount={unreadNotificationsCount}
      />

      {/* Top Header */}
      <Header
        cartCount={totalCartCount}
        cartTotalFormatted={formatDT(totalCartAmount)}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectCategory={setActiveCategory}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onScrollToPromotions={scrollToPromotions}
      />

      <main className="flex-1">
        {/* Hero Section with Welcome Text, Slogan & Enlarged Partner Brands */}
        <Hero
          totalProductsCount={CATALOG.length}
          onExploreClick={scrollToCatalog}
          onOpenPdfModal={() => setIsPdfModalOpen(true)}
          onExplorePromotions={scrollToPromotions}
        />

        {/* Company Description & Presentation (Grossistes, HORECA, GMS Carrefour, Monoprix, MG, Anouar) */}
        <CompanyDescriptionSection />

        {/* Dedicated Promotions & New Arrivals Zone (16% Promo on Maasdam only) */}
        <PromotionsSection
          products={ACTIVE_PROMOTIONS_AND_ARRIVALS}
          onAddToCart={handleAddToCart}
          cart={cart}
          onExploreFullCatalog={scrollToCatalog}
        />

        {/* Catalog Main Section */}
        <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest">
                <FileText className="w-3.5 h-3.5" />
                <span>Tous les Articles du Catalogue SMV Trading</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Catalogue Général & Tarifs
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Sélectionnez vos articles pour composer automatiquement le message de commande destiné au commercial.
              </p>
            </div>

            {/* Quick action to open order drawer */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Voir mon Bon de Commande ({totalCartCount})</span>
                <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-[11px]">
                  {formatDT(totalCartAmount)}
                </span>
              </button>
            </div>
          </div>

          {/* Filtering & Sorting Controls Bar */}
          <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            
            {/* Category Segmented Buttons with Promos and New Arrivals included */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 shrink-0">
                Catégorie :
              </span>
              {[
                { id: 'Toutes', label: `Toutes les Catégories (${CATALOG.length})` },
                { id: 'Nouveautés', label: '✨ Nouveaux Arrivages Frais' },
                { id: 'Fromages', label: 'Fromages (117)' },
                { id: 'Charcuterie Halal', label: 'Charcuterie Halal (16)' },
                { id: 'Charcuterie de Porc', label: 'Charcuterie de Porc (28)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat.id
                      ? cat.id === 'Promotions'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Second row: Brands, Search, Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-100">
              
              {/* Brand Dropdown */}
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Filtrer par Fournisseur :</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Toutes">Tous les Fournisseurs ({availableBrands.length})</option>
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search input in toolbar */}
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Code ou Référence :</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="7016, 7025, burrata, brie..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 p-2 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Trier par :</label>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-transparent border-none outline-none font-medium text-slate-800"
                  >
                    <option value="catalog">Ordre Catalogue (Pages 1 à 34)</option>
                    <option value="code">Code Produit croissant</option>
                    <option value="price-asc">Prix : Moins cher au plus cher</option>
                    <option value="price-desc">Prix : Plus cher au moins cher</option>
                    <option value="name">Désignation alphabétique</option>
                  </select>
                </div>
              </div>

              {/* Reset button */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setActiveCategory('Toutes');
                    setSelectedBrand('Toutes');
                    setSearchQuery('');
                    setSortBy('catalog');
                  }}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser les filtres</span>
                </button>
              </div>

            </div>

          </div>

          {/* Current results counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              Affichage de <strong>{filteredProducts.length}</strong> article{filteredProducts.length > 1 ? 's' : ''}
              {selectedBrand !== 'Toutes' ? ` chez ${selectedBrand}` : ''}
              {activeCategory !== 'Toutes' ? ` (${activeCategory})` : ''}
            </span>
            <span className="text-slate-400">Tarifs indicatifs HT / TTC en Dinars Tunisiens</span>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-slate-200 p-8">
              <Filter className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">Aucun article ne correspond à vos critères</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Vérifiez l'orthographe du code ou élargissez votre sélection de fournisseur.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('Toutes');
                  setSelectedBrand('Toutes');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Afficher tous les articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => {
                const inCart = cart.find((item) => item.product.code === product.code);
                return (
                  <ProductCard
                    key={product.code}
                    product={product}
                    onAddToCart={handleAddToCart}
                    cartQuantity={inCart ? inCart.quantity : 0}
                  />
                );
              })}
            </div>
          )}

        </section>

        {/* Commercial Banner */}
        <section className="bg-emerald-900 text-white py-12 border-t border-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">
                Service Commercial Dédié
              </span>
              <h3 className="text-2xl font-bold">
                Besoin d'une commande spécifique ou d'un devis pour conteneur ?
              </h3>
              <p className="text-xs text-emerald-100 max-w-xl">
                Nos commerciaux sont disponibles du lundi au samedi pour vous accompagner, vérifier la disponibilité des stocks et planifier vos livraisons.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:+216${COMMERCIAL_PHONE_DISPLAY.replace(/\s+/g, '')}`}
                className="px-5 py-3 bg-white text-emerald-950 hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all shadow-md"
              >
                Appeler : +216 {COMMERCIAL_PHONE_DISPLAY}
              </a>
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Ouvrir mon Bon de Commande
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Cart & Message Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        customerInfo={customerInfo}
        onCustomerInfoChange={setCustomerInfo}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onPrintOrder={() => setIsPrintModalOpen(true)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
      />

      {/* Professional Email Order Modal */}
      <EmailOrderModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        items={cart}
        customerInfo={customerInfo}
        onOpenPrintOrder={() => {
          setIsEmailModalOpen(false);
          setIsPrintModalOpen(true);
        }}
        onSentConfirm={() => {
          setToast({
            id: `${Date.now()}`,
            title: 'Bon de commande généré pour Email',
            description: 'Destinataire : commercial@smv-trading.com',
            type: 'success',
          });
        }}
      />

      {/* Notification Drawer (Center of Alerts & Novelties) */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onSelectProductNotification={handleSelectProductFromNotification}
        browserNotificationsEnabled={browserNotificationsEnabled}
        onRequestBrowserNotifications={handleRequestBrowserNotifications}
      />

      {/* PDF Catalog Modal */}
      <PDFCatalogViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      {/* Print Order Modal */}
      <PrintOrderModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        items={cart}
        customerInfo={customerInfo}
        onCustomerInfoChange={setCustomerInfo}
      />

      {/* Toast Notification */}
      <Toast
        toast={toast}
        onDismiss={() => setToast(null)}
      />

      {/* Footer */}
      <Footer onOpenPdfModal={() => setIsPdfModalOpen(true)} />

    </div>
  );
}
