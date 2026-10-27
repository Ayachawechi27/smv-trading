import { SMVProduct, NoveltyNotification } from '../types/ecommerce';
import rawCatalog from './smv_catalog.json';

const baseCatalog: SMVProduct[] = rawCatalog as SMVProduct[];

// Map of novelty & special arrival definitions by product code
// STRICT REQUIREMENT: Only Maasdam (#7C02) has a 16% promotion. No other item has a promotional discount.
export const PROMO_DEFINITIONS: Record<string, Partial<SMVProduct>> = {
  // EXCLUSIVE 16% PROMO ON MAASDAM ONLY
  '7C02': {
    isPromo: true,
    discountPercent: 16,
    originalPrice: 65.0,
    originalPriceFormatted: '65,000 DT',
    price: 54.6, // 65.0 - 16% = 54.600 DT
    priceFormatted: '54,600 DT',
    promoDescription: 'Offre Exceptionnelle : -16% de remise immédiate sur le Maasdam Holland 13 KG Veldhuyzen (54,600 DT au lieu de 65,000 DT)',
    arrivalBadge: '-16% PROMOTION',
    isNewArrival: false,
    promoValidUntil: 'Offre en cours',
  },

  // NEW ARRIVALS ONLY (No price discounts, strictly arrivals/novelties)
  '7192': {
    isNewArrival: true,
    arrivalBadge: 'Arrivage Frais Italie',
    promoDescription: 'Dernier arrivage direct Zanetti Italie (DLC fraîche garantie 30 jours)',
    arrivalDate: 'Réception récente',
  },
  '7173': {
    isNewArrival: true,
    arrivalBadge: 'Arrivage Frais',
    promoDescription: 'Mozzarella Di Bufala Zanetti 125g arrivage direct certifié AOP',
    arrivalDate: 'Réception récente',
  },
  '7016': {
    isNewArrival: true,
    arrivalBadge: 'Arrivage Frais France',
    promoDescription: 'Madame Loïk Ail & Fines Herbes 150g (Paysan Breton) - fraîcheur garantie',
    arrivalDate: 'Réception récente',
  },
  '7006': {
    isNewArrival: true,
    arrivalBadge: 'Produit Vedette',
    promoDescription: 'Emmental Portion 220g Paysan Breton (carton 20 pièces)',
  },
  '7025': {
    isNewArrival: true,
    arrivalBadge: 'Nouveau Stock',
    promoDescription: 'Brique Tradition 180g Paysan Breton DLC fraîche',
  },
  '7106': {
    isNewArrival: true,
    arrivalBadge: 'Affinage AOP',
    promoDescription: 'Parmigiano Reggiano AOP Zanetti 150g sélection noble',
  },
  '7651': {
    isNewArrival: true,
    arrivalBadge: 'Sélection Prestige',
    promoDescription: 'Comté Extra Fruité AOP Entremont affinage noble',
  },
  '7922': {
    isNewArrival: true,
    arrivalBadge: 'Arrivage Direct',
    promoDescription: 'Raclette savoureuse Entremont 250g (6 pièces par carton)',
  },
  '7C15': {
    isNewArrival: true,
    arrivalBadge: 'Exclusivité Basiron',
    promoDescription: 'Gouda vert au pesto d’origine hollandaise 4.5kg aux herbes aromatiques',
  },
  '6110': {
    isNewArrival: true,
    arrivalBadge: 'Nouveau Stock Halal',
    promoDescription: 'Filet de dinde fumé Volys Star charcuterie de volaille halal certifiée',
  },
  '5207': {
    isNewArrival: true,
    arrivalBadge: 'Saveur Tradition',
    promoDescription: 'Véritable terrine de campagne bretonne Mère Lalie 180g',
  },
  '5305': {
    isNewArrival: true,
    arrivalBadge: 'Arrivage Espagne',
    promoDescription: 'Jambon Serrano Bastides 100g tranché fin (DLC 90 jours)',
  },
  '7610': {
    isNewArrival: true,
    arrivalBadge: 'Nouvel Arrivage Frais',
    promoDescription: 'Caprice des Dieux 200g fraîchement réceptionné en direct de France',
  },
  '5316': {
    isNewArrival: true,
    arrivalBadge: 'Nouveau Format 300g',
    promoDescription: 'Mini Rosette Bastides 300g format spécial traiteur et restauration',
  }
};

// Return enriched catalog products with novelty & arrival flags
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

// Extracted list of all active novelties & arrivals
export const ACTIVE_PROMOTIONS_AND_ARRIVALS: SMVProduct[] = ENRICHED_CATALOG.filter(
  (p) => p.isPromo || p.isNewArrival
);

// Initial notifications list for client
export const INITIAL_NOTIFICATIONS: NoveltyNotification[] = [
  {
    id: 'notif-promo-maasdam',
    title: 'Promotion Exclusive : -16% sur le Maasdam Holland 13 KG',
    description: 'Offre spéciale en cours : Maasdam Holland 13 KG Veldhuyzen (#7C02) au tarif préférentiel de 54,600 DT/kg au lieu de 65,000 DT (-16% de remise immédiate).',
    date: 'En cours',
    type: 'promo',
    productCode: '7C02',
    discountBadge: '-16% REMISE',
    isRead: false,
  },
  {
    id: 'notif-1',
    title: 'Arrivage Frais : Burrata & Mozzarella di Bufala Zanetti (Italie)',
    description: 'Nouveau container direct d’Italie réceptionné dans nos entrepôts frigorifiques. DLC optimale garantie.',
    date: 'Aujourd’hui',
    type: 'arrival',
    productCode: '7192',
    discountBadge: 'Arrivage Frais',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'Nouveaux Arrivages : Comté AOP & Fromages Affinés Entremont',
    description: 'Arrivage direct de France : Comté Extra Fruité AOP #7651 et Parmigiano Reggiano AOP #7106.',
    date: 'Cette semaine',
    type: 'arrival',
    productCode: '7651',
    discountBadge: 'Arrivage Direct',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Gamme Fraîche Paysan Breton : Mme Loïk & Brique Tradition',
    description: 'Stocks complets disponibles sur Mme Loïk Ail & Fines Herbes #7016 et Emmental Portion #7006.',
    date: 'Cette semaine',
    type: 'arrival',
    productCode: '7016',
    discountBadge: 'Stock Frais',
    isRead: false,
  },
  {
    id: 'notif-4',
    title: 'Nouvelle Référence : Gouda Pesto Vert & Spécialités Basiron',
    description: 'Découvrez notre gamme de fromages de spécialité hollandais aux herbes et épices fines.',
    date: 'Récemment',
    type: 'arrival',
    productCode: '7C15',
    discountBadge: 'Nouveauté',
    isRead: false,
  },
];
