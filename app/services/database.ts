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
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Menu Items Collection
export const menuItemsRef = collection(db, 'menuItems');

export const getMenuItems = async () => {
  const snapshot = await getDocs(query(menuItemsRef, orderBy('category')));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getMenuItem = async (id: string) => {
  const docRef = doc(db, 'menuItems', id);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

// Categories Collection
export const getCategories = async () => {
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(query(categoriesRef, orderBy('order')));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getMenuItemsByCategory = async (categoryId: string) => {
  try {
    const q = query(
      menuItemsRef,
      where('category', '==', categoryId),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    return [];
  }
};

export const searchMenuItems = async (searchText: string) => {
  try {
    const snapshot = await getDocs(menuItemsRef);
    const allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return allItems.filter(item => 
      item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchText.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching menu items:', error);
    return [];
  }
};

// Orders Collection
export const ordersRef = collection(db, 'orders');

export const createOrder = async (orderData: any) => {
  const orderRef = doc(ordersRef);
  const orderWithTimestamp = {
    ...orderData,
    id: orderRef.id,
    createdAt: Timestamp.now(),
    status: 'pending'
  };
  await setDoc(orderRef, orderWithTimestamp);
  return orderWithTimestamp;
};

export const getUserOrders = async (userId: string) => {
  const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getOrder = async (orderId: string) => {
  const docRef = doc(db, 'orders', orderId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

// User Data
export const usersRef = collection(db, 'users');

export const createUserProfile = async (userId: string, userData: any) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...userData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const updateUserProfile = async (userId: string, userData: any) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...userData,
    updatedAt: Timestamp.now()
  });
};
