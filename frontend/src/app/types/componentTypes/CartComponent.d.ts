import { Feature } from "@/app/types/layoutTypes/CategorySection";

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
  sku: number;
  additionalFeatures: Feature[];
  quantity: number;
}
