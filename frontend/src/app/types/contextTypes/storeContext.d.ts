import { OrderData } from "../componentTypes/CartComponent";

export interface StoreContextType {
  selectedCategory: any;
  categories: any;
  products: any;
  selectCategory: (categoryName: string) => void;
}
