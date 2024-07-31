import { OrderData } from "../componentTypes/CartComponent";

export interface CartContextType {
  cart: CartItem[];
  updateCart: (quantity: number, key: string) => void;
  deleteItem: (key: string) => void;
  addItem: (orderData: OrderData) => void;
}
