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
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp
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

// ============= CART INTERFACES AND FUNCTIONS =============
export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  specialInstructions?: string;
}

export interface UserCart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Initialize user cart
export const initializeUserCart = async (userId: string): Promise<UserCart> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    const initialCart: Omit<UserCart, 'id'> = {
      userId,
      items: [],
      total: 0,
      itemCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    await setDoc(cartRef, initialCart);
    
    return {
      id: userId,
      ...initialCart
    };
  } catch (error) {
    console.error('Error initializing cart:', error);
    throw error;
  }
};

// Get user cart
export const getUserCart = async (userId: string): Promise<UserCart> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      return {
        id: cartSnap.id,
        ...cartSnap.data()
      } as UserCart;
    }
    
    // Create cart if it doesn't exist
    return await initializeUserCart(userId);
  } catch (error) {
    console.error('Error getting user cart:', error);
    throw error;
  }
};

// Add or update item in cart
export const updateCartItem = async (
  userId: string, 
  itemData: Omit<CartItem, 'id'>
): Promise<UserCart> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartSnap = await getDoc(cartRef);
    
    let cartData: UserCart;
    
    if (cartSnap.exists()) {
      cartData = {
        id: cartSnap.id,
        ...cartSnap.data()
      } as UserCart;
    } else {
      // Create new cart
      cartData = await initializeUserCart(userId);
    }
    
    // Generate item ID
    const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newItem: CartItem = {
      ...itemData,
      id: itemId
    };
    
    // Check if item already exists
    const existingItemIndex = cartData.items.findIndex(
      item => item.menuItemId === itemData.menuItemId
    );
    
    let updatedItems: CartItem[];
    
    if (existingItemIndex > -1) {
      // Update existing item quantity
      updatedItems = [...cartData.items];
      updatedItems[existingItemIndex].quantity += itemData.quantity;
    } else {
      // Add new item
      updatedItems = [...cartData.items, newItem];
    }
    
    // Calculate totals
    const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart in Firebase
    await updateDoc(cartRef, {
      items: updatedItems,
      total,
      itemCount,
      updatedAt: Timestamp.now()
    });
    
    return {
      ...cartData,
      items: updatedItems,
      total,
      itemCount,
      updatedAt: Timestamp.now()
    };
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (
  userId: string, 
  itemId: string, 
  quantity: number
): Promise<UserCart> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartSnap = await getDoc(cartRef);
    
    if (!cartSnap.exists()) {
      throw new Error('Cart not found');
    }
    
    const cartData = {
      id: cartSnap.id,
      ...cartSnap.data()
    } as UserCart;
    
    // Find and update the item
    const updatedItems = cartData.items.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    }).filter(item => item.quantity > 0); // Remove items with quantity 0
    
    // Calculate totals
    const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart in Firebase
    await updateDoc(cartRef, {
      items: updatedItems,
      total,
      itemCount,
      updatedAt: Timestamp.now()
    });
    
    return {
      ...cartData,
      items: updatedItems,
      total,
      itemCount,
      updatedAt: Timestamp.now()
    };
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

// Remove item from cart
export const removeCartItem = async (
  userId: string, 
  itemId: string
): Promise<UserCart> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartSnap = await getDoc(cartRef);
    
    if (!cartSnap.exists()) {
      throw new Error('Cart not found');
    }
    
    const cartData = {
      id: cartSnap.id,
      ...cartSnap.data()
    } as UserCart;
    
    // Remove the item
    const updatedItems = cartData.items.filter(item => item.id !== itemId);
    
    // Calculate totals
    const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart in Firebase
    await updateDoc(cartRef, {
      items: updatedItems,
      total,
      itemCount,
      updatedAt: Timestamp.now()
    });
    
    return {
      ...cartData,
      items: updatedItems,
      total,
      itemCount,
      updatedAt: Timestamp.now()
    };
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

// Clear user cart
export const clearUserCart = async (userId: string): Promise<void> => {
  try {
    const cartRef = doc(db, 'carts', userId);
    await updateDoc(cartRef, {
      items: [],
      total: 0,
      itemCount: 0,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// ============= ORDERS INTERFACES AND FUNCTIONS =============
export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  phoneNumber: string;
  specialInstructions?: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Timestamp;
  estimatedDeliveryTime?: Timestamp;
  notes?: string;
}

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

// ============= MENU ITEMS =============
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
    const allItems = await getMenuItems();
    
    if (!searchText.trim()) {
      return allItems;
    }
    
    const searchLower = searchText.toLowerCase();
    
    return allItems.filter(item => {
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

// ============= USER PROFILE =============
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

// ============= FAVORITES =============
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

// ============= ADMIN FUNCTIONS =============
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
