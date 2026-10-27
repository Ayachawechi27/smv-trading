import { SMVProduct, NoveltyNotification } from '../types/ecommerce';
import rawCatalog from './smv_catalog.json';

const baseCatalog: SMVProduct[] = rawCatalog as SMVProduct[];

// Map of promotional & novelty overrides by product code
export const PROMO_DEFINITIONS: Record<string, Partial<SMVProduct>> = {
  '7006': {
    isPromo: true,
    discountPercent: 15,
    originalPrice: 27.600,
    originalPriceFormatted: '27,600 DT',
    promoDescription: 'Remise spéciale 15% sur le carton 20 pièces',
    promoValidUntil: '31 Mai 2026',
  },
  '7016': {
    isPromo: true,
    discountPercent: 10,
    originalPrice: 17.500,
    originalPriceFormatted: '17,500 DT',
    promoDescription: 'Offre promotionnelle Madame Loïk Ail & Fines Herbes',
    promoValidUntil: '31 Mai 2026',
  },
  '7025': {
    isPromo: true,
    discountPercent: 10,
    originalPrice: 21.000,
    originalPriceFormatted: '21,000 DT',
    promoDescription: 'Prix préférentiel Brique Tradition Paysan Breton',
    promoValidUntil: '15 Juin 2026',
  },
  '7192': {
    isNewArrival: true,
    arrivalBadge: 'Arrivage Frais Italie',
    promoDescription: 'Dernier arrivage direct Zanetti Italie (DLC fraîche garantie 30 jours)',
  },
  '7106': {
    isPromo: true,
    discountPercent: 15,
    originalPrice: 31.800,
    originalPriceFormatted: '31,800 DT',
    promoDescription: 'Offre sélection Parmigiano Reggiano AOP affiné',
    promoValidUntil: '31 Mai 2026',
  },
  '7651': {
    isPromo: true,
    discountPercent: 12,
    originalPrice: 148.000,
    originalPriceFormatted: '148,000 DT',
    promoDescription: 'Arrivage Comté Extra Fruité AOP Entremont affinage noble',
    promoValidUntil: '31 Mai 2026',
  },
  '7922': {
    isPromo: true,
    discountPercent: 12,
    originalPrice: 26.900,
    originalPriceFormatted: '26,900 DT',
    promoDescription: 'Remise raclette fondante Entremont 250g',
    promoValidUntil: '15 Juin 2026',
  },
  '7C15': {
    isNewArrival: true,
    arrivalBadge: 'Exclusivité Basiron',
    promoDescription: 'Gouda vert au pesto d’origine hollandaise 4.5kg',
  },
  '6110': {
    isPromo: true,
    discountPercent: 12,
    originalPrice: 142.000,
    originalPriceFormatted: '142,000 DT',
    promoDescription: 'Offre spéciale Volys Star charcuterie halal de dinde fumée',
    promoValidUntil: '31 Mai 2026',
  },
  '5207': {
    isPromo: true,
    discountPercent: 17,
    originalPrice: 14.500,
    originalPriceFormatted: '14,500 DT',
    promoDescription: 'Remise terrine de campagne bretonne Mère Lalie 180g',
    promoValidUntil: '31 Mai 2026',
  },
  '5305': {
    isPromo: true,
    discountPercent: 14,
    originalPrice: 17.500,
    originalPriceFormatted: '17,500 DT',
    promoDescription: 'Offre Jambon Serrano Bastides 100g tranché fin',
    promoValidUntil: '15 Juin 2026',
  },
  '7610': {
    isNewArrival: true,
    arrivalBadge: 'Nouvel Arrivage Frais',
    promoDescription: 'Caprice des Dieux 200g fraîchement réceptionné',
  },
  '7173': {
    isNewArrival: true,
    arrivalBadge: 'Arrivage Frais',
    promoDescription: 'Mozzarella Di Bufala Zanetti 125g arrivage direct',
  },
  '5316': {
    isNewArrival: true,
    arrivalBadge: 'Nouveau Format 300g',
    promoDescription: 'Mini Rosette Bastides 300g format spécial traiteur',
  }
};

// Return enriched catalog products with promotion & arrival flags
export const ENRICHED_CATALOG: SMVProduct[] = baseCatalog.map((product) => {
  const overrides = PROMO_DEFINITIONS[product.code];
  if (overrides) {
    return {
      ...product,
      ...overrides,
    };
  }
  return product;
});

// Extracted list of all active promotions & arrivals
export const ACTIVE_PROMOTIONS_AND_ARRIVALS: SMVProduct[] = ENRICHED_CATALOG.filter(
  (p) => p.isPromo || p.isNewArrival
);

// Initial notifications list for client
export const INITIAL_NOTIFICATIONS: NoveltyNotification[] = [
  {
    id: 'notif-1',
    title: 'Arrivage Frais : Burrata & Mozzarella di Bufala Zanetti',
    description: 'Nouveau container direct d’Italie réceptionné dans nos entrepôts frigorifiques. DLC optimale garantie.',
    date: 'Aujourd’hui',
    type: 'arrival',
    productCode: '7192',
    discountBadge: 'Arrivage Frais',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'Remise -15% sur le Parmigiano Reggiano 150g & Emmental Portion',
    description: 'Offre exclusive grossiste valable jusqu’au 31 mai 2026 sur les références #7106 et #7006.',
    date: 'Cette semaine',
    type: 'promo',
    productCode: '7106',
    discountBadge: '-15% Remise',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Offre Spéciale Volys Star & Charcuterie de Volaille Halal',
    description: 'Profitez de tarifs préférentiels sur le filet de dinde fumé #6110 et les terrines bretonnes.',
    date: 'Cette semaine',
    type: 'promo',
    productCode: '6110',
    discountBadge: '-12% Remise',
    isRead: false,
  },
  {
    id: 'notif-4',
    title: 'Nouvelle Référence : Gouda Pesto Vert & Zaatar Basiron',
    description: 'Découvrez notre nouvelle gamme de fromages de spécialité hollandais aux herbes et épices fines.',
    date: 'Récemment',
    type: 'arrival',
    productCode: '7C15',
    discountBadge: 'Nouveauté 2026',
    isRead: false,
  },
];
