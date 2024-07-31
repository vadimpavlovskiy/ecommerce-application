'use client'
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { OrderData } from '../types/componentTypes/CartComponent';

interface CartItem {
  id: string;
  name: string;
  color?: string;
  textile?: string;
  matress?: string;
  additionalFeatures?: string[];
  totalPrice: number;
  quantity: number;
}

interface CartState {
  items:  { [key: string]: CartItem };
}
const initialState: CartState = {
  items: {},
};

type CartAction =
  | { type: 'SET_CART'; payload: { [key: string]: CartItem }  }
  | { type: 'UPDATE_CART'; payload: { [key: string]: CartItem } }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'ADD_ITEMS'; payload: { [key: string]: CartItem } }


const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | undefined>(undefined);

const cartReducer = (state: CartState = initialState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: { ...state.items, ...action.payload },
      }
    case 'UPDATE_CART':
      return {
        ...state,
        items: { ...state.items, ...action.payload },
      };
    case 'DELETE_ITEM':
      const { [action.payload]: _, ...rest } = state.items
      return {
        ...state,
        items: rest,
    };

    case 'ADD_ITEMS':
      return {
      ...state,
      items: { ...state.items, ...action.payload },
    };


    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartProvider, useCart };
