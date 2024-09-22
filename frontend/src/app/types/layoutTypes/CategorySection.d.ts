export interface Sku {
  id: number;
  product_id: number;
  code: string;
  image: string | null;
  price: number;
  discounted_price: number;
  created_at: string;
  updated_at: string;
  attribute_options: AttributeOption[];
  images: Image[];
}
export interface Image {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    sku_id: number;
    image_id: number;
  };
}
export interface AttributeOption {
  id: number;
  attribute_id: number;
  value: string;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
  attribute: Attribute;
}

export interface Attribute {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface Pivot {
  sku_id: number;
  attribute_option_id: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string | null;
  length: number | null;
  width: number | null;
  height: number | null;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
  skus: Sku[];
  features: Feature[];
  custom_properties: CustomProperty[];
}

export interface CustomProperty {
  key: string;
  value: string;
}
export interface Feature {
  id: number;
  name: string;
  price: string;
  created_at: string;
  updated_at: string;
  pivot: {
    product_id: number;
    feature_id: number;
  };
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
