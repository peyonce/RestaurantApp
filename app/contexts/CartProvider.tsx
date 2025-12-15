import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthProvider';

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  specialInstructions?: string;
}

export interface CartContextType {
  items: CartItem[];
  total: number;
  clearCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  // Initialize cart from localStorage or create empty
  useEffect(() => {
    const loadCart = () => {
      try {
        const cartKey = user ? `cart_${user.uid}` : 'cart_guest';
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          setItems(cartData.items || []);
          setTotal(cartData.total || 0);
        }
      } catch (error) {
        console.log('No saved cart found, starting fresh');
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const saveCart = () => {
      try {
        const cartKey = user ? `cart_${user.uid}` : 'cart_guest';
        const cartData = {
          items,
          total,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(cartKey, JSON.stringify(cartData));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    saveCart();
  }, [items, total, user]);

  const updateTotal = (cartItems: CartItem[]) => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };

  const addToCart = async (itemData: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...itemData,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedItems = [...items];
    const existingItemIndex = updatedItems.findIndex(item => 
      item.menuItemId === newItem.menuItemId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      updatedItems[existingItemIndex].quantity += newItem.quantity;
    } else {
      // Add new item
      updatedItems.push(newItem);
    }

    setItems(updatedItems);
    updateTotal(updatedItems);
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setItems(updatedItems);
    updateTotal(updatedItems);
  };

  const removeItem = async (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    updateTotal(updatedItems);
  };

  const clearCart = async () => {
    setItems([]);
    setTotal(0);
    try {
      const cartKey = user ? `cart_${user.uid}` : 'cart_guest';
      localStorage.removeItem(cartKey);
    } catch (error) {
      console.error('Error clearing cart from storage:', error);
    }
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const contextValue: CartContextType = {
    items,
    total,
    clearCart,
    addToCart,
    updateItemQuantity,
    removeItem,
    getItemCount,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
