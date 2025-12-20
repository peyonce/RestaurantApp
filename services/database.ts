import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc, getDoc, Timestamp, setDoc } from 'firebase/firestore';
import { db } from '@/app/config/firebase';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  menuItemId?: string;
}

export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: Array<{
    id: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  phone: string;
  address: string;
  paymentMethod: 'cash' | 'card';
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryFee: number;
  tipAmount: number;
  subtotal: number;
  specialInstructions: string;
  createdAt?: any;
  estimatedDelivery?: Date;
}

export const getUserCart = async (userId: string): Promise<{items: CartItem[], total: number}> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      const cartData = cartSnap.data();
      return {
        items: cartData.items || [],
        total: cartData.total || 0
      };
    }
    
    return { items: [], total: 0 };
  } catch (error) {
    console.error('Error getting user cart:', error);
    return { items: [], total: 0 };
  }
};

export const updateUserCart = async (userId: string, items: CartItem[]): Promise<{items: CartItem[], total: number}> => {
  try {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartRef = doc(db, 'carts', userId);
    
    await setDoc(cartRef, {
      userId,
      items,
      total,
      updatedAt: new Date()
    }, { merge: true });
    
    return { items, total };
  } catch (error) {
    console.error('Error updating user cart:', error);
    throw error;
  }
};

export const clearUserCart = async (userId: string): Promise<void> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    await updateDoc(cartRef, {
      items: [],
      total: 0,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error clearing user cart:', error);
    throw error;
  }
};

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

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(ordersQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    
    if (orderDoc.exists()) {
      return {
        id: orderDoc.id,
        ...orderDoc.data()
      } as Order;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    return null;
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
    console.log('🔥 [Firebase] Menu items retrieved:', items.length);
    return items;
  } catch (error) {
    console.error('🔥 [Firebase] Error getting menu items:', error);
    return [];
  }
};

export const getMenuItemById = async (itemId: string): Promise<any> => {
  try {
    console.log('🔥 [Firebase] Getting menu item:', itemId);
    const menuRef = doc(db, 'menuItems', itemId);
    const snapshot = await getDoc(menuRef);
    
    if (snapshot.exists()) {
      const item = { 
        id: snapshot.id, 
        ...snapshot.data(),
        price: Number(snapshot.data().price) || 0
      };
      console.log('🔥 [Firebase] Menu item retrieved:', item);
      return item;
    }
    
    console.log('🔥 [Firebase] Menu item not found:', itemId);
    return null;
  } catch (error) {
    console.error('🔥 [Firebase] Error getting menu item:', error);
    return null;
  }
};
