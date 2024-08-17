'use client'
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Category, Product } from '../types/layoutTypes/CategorySection';


interface StoreState {
  products: Product[];
  originalProducts: Product[];
  categories: Category[];
  selectedCategory: Category[] | null;
  sortType: 'none' | 'low-to-high' | 'high-to-low';
  
}

const initialState: StoreState = {
  products: [],
  originalProducts: [],
  categories: [],
  selectedCategory: null,
  sortType: 'none',
};

type StoreAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_PAGINATED_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_CATEGORY'; payload: number | null }
  | { type: 'SET_SORT'; payload: 'none' | 'low-to-high' | 'high-to-low' }
  | { type: 'SET_PRICE_FILTER'; payload: number | null}

const StoreContext = createContext<{ state: StoreState; dispatch: React.Dispatch<StoreAction> } | undefined>(undefined);

const storeReducer = (state: StoreState, action: StoreAction): StoreState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        originalProducts: action.payload
      };
    case 'SET_PAGINATED_PRODUCTS':
      return {
        ...state,
        products: action.payload
      };
    case 'SET_CATEGORY':
        const sortedCategory = state.categories.filter((category, index) => category.id === action.payload);
        const productsFromCategory = sortedCategory[0].products;
      return {
        ...state,
        selectedCategory: sortedCategory,
        products: productsFromCategory,
        originalProducts: productsFromCategory
      };
      case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
    case 'SET_SORT':
      const sortedProducts = [...state.originalProducts];
      if (action.payload === 'low-to-high') {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (action.payload === 'high-to-low') {
        sortedProducts.sort((a, b) => b.price - a.price);
      } else if (action.payload === 'none') {
        sortedProducts.sort((a, b) => Number(a.id) - Number(b.id));
      }
    
      return {
        ...state,
        products: sortedProducts,
      };
    case 'SET_PRICE_FILTER':
      const sortedPriceProducts:Product[] = state.originalProducts.filter((product, index) => {
        if(action.payload) {
          return product.discounted_price <= action.payload
        }
      })
      console.dir(
        {
          "original": state.originalProducts,
          "sorted": sortedPriceProducts, 
          "action": action.payload}
      )
        return {
          ...state,
          products: sortedPriceProducts
        }
    default:
      throw new Error(`Unhandled action type`);
  }
};

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export { StoreProvider, useStore };
