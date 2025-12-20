 import {
  addDoc,
  collection,
  doc, getDoc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Types
export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  imageUrl?: string;
  specialInstructions?: string;
}

export interface Order {
  id?: string;  // Added optional id for Firestore
  userId: string;
  items: CartItem[];
  total: number;
  address: string;
  phone: string;
  payment: string;
  status: string;
  createdAt: Timestamp;
  userEmail: string;
  userName: string;
  deliveryFee: number;
  tipAmount: number;
  tipPercentage: number;
  subtotal: number;
  totalAmount: number;
  phoneNumber: string;
  specialInstructions?: string;
  paymentMethod: 'cash' | 'card';
  paymentStatus: 'pending' | 'completed' | 'failed';
  notes?: string;
}

// Cart Functions - SIMPLIFIED AND FIXED
export const getUserCart = async (userId: string): Promise<{items: CartItem[], total: number}> => {
  try {
    console.log('🔥 [Firebase] Getting cart for user:', userId);
    
    const cartRef = doc(db, 'carts', userId);
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      const data = cartSnap.data();
      console.log('🔥 [Firebase] Cart data:', {
        items: data.items,
        total: data.total,
        itemsCount: data.items?.length || 0
      });
      
      // Make sure items is an array and has correct structure
      const items = Array.isArray(data.items) ? data.items.map(item => ({
        id: item.id || `item_${Date.now()}`,
        menuItemId: item.menuItemId || '',
        name: item.name || 'Unknown Item',
        price: typeof item.price === 'number' ? item.price : 0,
        quantity: typeof item.quantity === 'number' ? item.quantity : 1,
        imageUrl: item.imageUrl || '',
        specialInstructions: item.specialInstructions || ''
      })) : [];
      
      const total = typeof data.total === 'number' ? data.total : 0;
      
      console.log('🔥 [Firebase] Processed cart:', { items, total });
      return { items, total };
    } else {
      console.log('🔥 [Firebase] Creating new cart');
      // Create empty cart
      await setDoc(cartRef, {
        items: [],
        total: 0,
        userId,
        updatedAt: Timestamp.now()
      });
      return { items: [], total: 0 };
    }
  } catch (error) {
    console.error('🔥 [Firebase] Error getting user cart:', error);
    return { items: [], total: 0 };
  }
};

export const updateUserCart = async (userId: string, items: CartItem[]): Promise<{items: CartItem[], total: number}> => {
  try {
    console.log('🔥 [Firebase] Updating cart for:', userId);
    console.log('🔥 [Firebase] Items to save:', items);
    
    // Calculate total properly
    const total = items.reduce((sum, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      console.log(`🔥 Item: ${item.name}, Price: ${item.price}, Qty: ${item.quantity}, Total: ${itemTotal}`);
      return sum + itemTotal;
    }, 0);
    
    console.log('🔥 [Firebase] Calculated total:', total);
    
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, {
      items: items.map(item => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl || '',
        specialInstructions: item.specialInstructions || ''
      })),
      total: total,
      userId,
      updatedAt: Timestamp.now()
    }, { merge: true });
    
    console.log('🔥 [Firebase] Cart saved successfully');
    return { items, total };
  } catch (error) {
    console.error('🔥 [Firebase] Error updating cart:', error);
    throw error;
  }
};

export const clearUserCart = async (userId: string): Promise<void> => {
  try {
    console.log('🔥 [Firebase] Clearing cart for:', userId);
    const cartRef = doc(db, 'carts', userId);
    await updateDoc(cartRef, {
      items: [],
      total: 0,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('🔥 [Firebase] Error clearing cart:', error);
    throw error;
  }
};

// Order Functions
export const createOrder = async (orderData: Omit<Order, 'createdAt' | 'id'>): Promise<Order & {id: string}> => {
  try {
    console.log('🔥 [Firebase] Creating order:', orderData);
    
    // Validate items
    if (!orderData.items || !Array.isArray(orderData.items)) {
      throw new Error('Invalid order items');
    }
    
    const ordersRef = collection(db, 'orders');
    const order = {
      ...orderData,
      createdAt: Timestamp.now()
    };
    
    console.log('🔥 [Firebase] Order to save:', order);
    
    const docRef = await addDoc(ordersRef, order);
    console.log('🔥 [Firebase] Order created with ID:', docRef.id);
    
    return { 
      id: docRef.id, 
      ...order 
    };
  } catch (error) {
    console.error('🔥 [Firebase] Error creating order:', error);
    throw error;
  }
};

// Menu Functions
export const getMenuItems = async (): Promise<any[]> => {
  try {
    console.log('🔥 [Firebase] Getting menu items');
    const menuRef = collection(db, 'menuItems');
    const snapshot = await getDocs(menuRef);
    const items = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      price: Number(doc.data().price) || 0
    }));
    
    console.log('🔥 [Firebase] Found menu items:', items.length);
    return items;
  } catch (error) {
    console.error('🔥 [Firebase] Error getting menu:', error);
    return [];
  }
};

// Get single menu item
export const getMenuItemById = async (itemId: string): Promise<any> => {
  try {
    console.log('🔥 [Firebase] Getting menu item:', itemId);
    const menuRef = doc(db, 'menuItems', itemId);
    const snapshot = await getDoc(menuRef);
    
    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        price: Number(data.price) || 0
      };
    } else {
      console.log('🔥 [Firebase] Menu item not found:', itemId);
      return null;
    }
  } catch (error) {
    console.error('🔥 [Firebase] Error getting menu item:', error);
    throw error;
  }
};