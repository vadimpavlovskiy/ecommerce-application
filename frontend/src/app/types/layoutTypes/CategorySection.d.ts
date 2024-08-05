export interface CustomProperty {
  key?: string;
  name?: string;
  type: string;
  value?: string;
  image?: string;
  price?: string;
  dynamicTypeFields: string;
}

export interface Pivot {
  category_id: number;
  product_id: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  length: number;
  width: number;
  height: number;
  sleeping_area_length: number;
  sleeping_area_width: number;
  price: number;
  discounted_price: number;
  thumbnail: string;
  image: string;
  custom_properties: CustomProperty[];
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  products: Product[];
}
