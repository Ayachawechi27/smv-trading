export type ProductCategory = 
  | 'Toutes'
  | 'Fromages'
  | 'Charcuterie Halal'
  | 'Charcuterie de Porc';

export interface SMVProduct {
  code: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  priceFormatted: string;
  dlc: string;
  packing: string;
  isPerKg: boolean;
  image: string;
  page: number;
}

export interface SMVCartItem {
  product: SMVProduct;
  quantity: number;
}

export interface CustomerOrderInfo {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  deliveryZone: string;
  companyName?: string;
  address?: string;
  notes?: string;
}

export interface PlacedOrder {
  id: string;
  date: string;
  items: SMVCartItem[];
  total: number;
  totalFormatted: string;
  customer: CustomerOrderInfo;
  messageText: string;
}
