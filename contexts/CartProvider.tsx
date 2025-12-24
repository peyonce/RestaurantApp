import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, clearUserCart, getUserCart, updateUserCart } from '../services/database';
import { useAuth } from './AuthProvider';

interface CartContextType {
  items: CartItem[];
  total: number;
  loading: boolean;
  itemCount: number; 
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  useEffect(() => {
    const loadCart = async () => {
      console.log(' Loading cart, user:', user?.uid);
      
      if (!user) {
        console.log(' No user, clearing cart');
        setItems([]);
        setTotal(0);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const cart = await getUserCart(user.uid);
        console.log(' Cart loaded from Firebase:', cart);
        
        const safeItems = Array.isArray(cart.items) ? cart.items : [];
        const safeTotal = typeof cart.total === 'number' ? cart.total : 0;
        
        setItems(safeItems);
        setTotal(safeTotal);
      } catch (error) {
        console.error(' Error loading cart:', error);
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const addToCart = async (itemData: Omit<CartItem, 'id'>) => {
    if (!user) {
      console.error(' No user logged in');
      return;
    }
    
    console.log('Adding to cart:', itemData);
    
    try {
       
      const newItem: CartItem = {
        ...itemData,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const existingIndex = items.findIndex(i => i.menuItemId === itemData.menuItemId);
      let newItems: CartItem[];

      if (existingIndex > -1) {
         
        newItems = items.map((item, index) =>
          index === existingIndex 
            ? { 
                ...item, 
                quantity: (item.quantity || 1) + (itemData.quantity || 1) 
              }
            : item
        );
      } else {
        
        newItems = [...items, { ...newItem, quantity: newItem.quantity || 1 }];
      }

      console.log('Saving updated items to Firebase:', newItems);
      
      const updated = await updateUserCart(user.uid, newItems);
      
      setItems(updated.items || []);
      setTotal(updated.total || 0);
      
      console.log('Cart updated successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
       
      const newItem: CartItem = {
        ...itemData,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        quantity: itemData.quantity || 1
      };
      
      const existingIndex = items.findIndex(i => i.menuItemId === itemData.menuItemId);
      if (existingIndex > -1) {
        const updatedItems = items.map((item, index) =>
          index === existingIndex 
            ? { ...item, quantity: (item.quantity || 1) + (itemData.quantity || 1) }
            : item
        );
        setItems(updatedItems);
      } else {
        setItems(prev => [...prev, newItem]);
      }
    }
  };

  const removeItem = async (itemId: string) => {
    if (!user) return;
    
    try {
      const newItems = items.filter(item => item.id !== itemId);
      const updated = await updateUserCart(user.uid, newItems);
      setItems(updated.items || []);
      setTotal(updated.total || 0);
    } catch (error) {
      console.error('Error removing item:', error);
       
      const newItems = items.filter(item => item.id !== itemId);
      setItems(newItems);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;
    
    if (quantity < 1) {
      await removeItem(itemId);
      return;
    }
    
    try {
      const newItems = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const updated = await updateUserCart(user.uid, newItems);
      setItems(updated.items || []);
      setTotal(updated.total || 0);
    } catch (error) {
      console.error('Error updating quantity:', error);
       
      const newItems = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setItems(newItems);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    try {
      await clearUserCart(user.uid);
      setItems([]);
      setTotal(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
       
      setItems([]);
      setTotal(0);
    }
  };

  const value: CartContextType = {
    items,
    total,
    loading,
    itemCount,   
    addToCart,
    removeItem,
    clearCart,
    updateQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};