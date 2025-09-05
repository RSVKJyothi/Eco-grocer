// Types for the EcoGrocer app

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface KitchenItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'daily' | 'weekly' | 'monthly';
  lastUpdated: Date;
}

export interface PurchaseHistory {
  date: string;
  item: string;
  quantity: number;
  unit: string;
}