export interface CartItem {
  key: string;
  name: string;
  color?: string;
  textile?: string;
  matress?: string;
  additionalFeatures?: string[];
  totalPrice: number;
  quantity: number;
}

export interface OrderData {
  cart_id: string;
  productId: string;
  sku: string;
  color: string;
  textile: string | null;
  matress: string;
  additionalFeatures: string[];
  quantity: number;
}
