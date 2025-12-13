import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Define TypeScript interfaces
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  ingredients?: string[];
  isAvailable?: boolean;
  calories?: number;
  preparationTime?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  order: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Timestamp;
  estimatedDeliveryTime?: Timestamp;
  notes?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  favorites?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Menu Items Collection
export const menuItemsRef = collection(db, 'menuItems');

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const snapshot = await getDocs(query(menuItemsRef, orderBy('category'), orderBy('name')));
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as MenuItem));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

export const getMenuItem = async (id: string): Promise<MenuItem | null> => {
  try {
    const docRef = doc(db, 'menuItems', id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as MenuItem : null;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return null;
  }
};

// Categories Collection
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(query(categoriesRef, orderBy('order')));
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getMenuItemsByCategory = async (categoryId: string): Promise<MenuItem[]> => {
  try {
    const q = query(
      menuItemsRef,
      where('category', '==', categoryId),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as MenuItem));
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    return [];
  }
};

export const searchMenuItems = async (searchText: string): Promise<MenuItem[]> => {
  try {
    // Get all menu items
    const allItems = await getMenuItems();
    
    if (!searchText.trim()) {
      return allItems;
    }
    
    const searchLower = searchText.toLowerCase();
    
    return allItems.filter(item => {
      // Type-safe search - we know item has name and description from MenuItem interface
      return (
        item.name.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower))
      );
    });
  } catch (error) {
    console.error('Error searching menu items:', error);
    return [];
  }
};

// Orders Collection
export const ordersRef = collection(db, 'orders');

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
  try {
    const orderRef = doc(ordersRef);
    const orderWithTimestamp: Order = {
      ...orderData,
      id: orderRef.id,
      createdAt: Timestamp.now()
    };
    await setDoc(orderRef, orderWithTimestamp);
    return orderWithTimestamp;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Order));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as Order : null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { 
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// User Data
export const usersRef = collection(db, 'users');

export const createUserProfile = async (userId: string, userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userProfile: UserProfile = {
      ...userData,
      id: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    await setDoc(userRef, userProfile);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as UserProfile : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, userData: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Cart Operations
export interface CartItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  imageUrl?: string;
}

// Favorites
export const addToFavorites = async (userId: string, menuItemId: string): Promise<void> => {
  try {
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    
    const favorites = userProfile.favorites || [];
    if (!favorites.includes(menuItemId)) {
      favorites.push(menuItemId);
      await updateUserProfile(userId, { favorites });
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, menuItemId: string): Promise<void> => {
  try {
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    
    const favorites = (userProfile.favorites || []).filter(id => id !== menuItemId);
    await updateUserProfile(userId, { favorites });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getFavoriteMenuItems = async (userId: string): Promise<MenuItem[]> => {
  try {
    const userProfile = await getUserProfile(userId);
    if (!userProfile || !userProfile.favorites || userProfile.favorites.length === 0) {
      return [];
    }
    
    const favoriteItems: MenuItem[] = [];
    for (const itemId of userProfile.favorites) {
      const item = await getMenuItem(itemId);
      if (item) {
        favoriteItems.push(item);
      }
    }
    
    return favoriteItems;
  } catch (error) {
    console.error('Error fetching favorite items:', error);
    return [];
  }
};

// Admin Functions
export const addMenuItem = async (menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  try {
    const menuItemRef = doc(menuItemsRef);
    const newMenuItem: MenuItem = {
      ...menuItem,
      id: menuItemRef.id
    };
    await setDoc(menuItemRef, newMenuItem);
    return newMenuItem;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

export const updateMenuItem = async (id: string, menuItem: Partial<MenuItem>): Promise<void> => {
  try {
    const menuItemRef = doc(db, 'menuItems', id);
    await updateDoc(menuItemRef, menuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    const menuItemRef = doc(db, 'menuItems', id);
    await deleteDoc(menuItemRef);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};
