 import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query, // Added
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Booking {
  id?: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// Validation helper function
const validateBookingData = (bookingData: {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}) => {
  // Required fields
  if (!bookingData.userId?.trim()) {
    throw new Error('User ID is required');
  }
  if (!bookingData.restaurantId?.trim()) {
    throw new Error('Restaurant ID is required');
  }
  if (!bookingData.restaurantName?.trim()) {
    throw new Error('Restaurant name is required');
  }
  if (!bookingData.date?.trim()) {
    throw new Error('Date is required');
  }
  if (!bookingData.time?.trim()) {
    throw new Error('Time is required');
  }

  // Guests validation
  if (!Number.isInteger(bookingData.guests) || bookingData.guests < 1 || bookingData.guests > 50) {
    throw new Error('Number of guests must be between 1 and 50');
  }

  // Date validation
  const bookingDate = new Date(bookingData.date);
  if (isNaN(bookingDate.getTime())) {
    throw new Error('Invalid date format. Use YYYY-MM-DD');
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (bookingDate < today) {
    throw new Error('Booking date cannot be in the past');
  }

  // Time validation (basic format check)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(bookingData.time)) {
    throw new Error('Invalid time format. Use HH:MM (24-hour format)');
  }
};

// SIMPLER VERSION: Accepts complete booking data
export const createBooking = async (bookingData: {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}) => {
  try {
    // Validate input
    validateBookingData(bookingData);

    const booking: Omit<Booking, 'id'> = {
      userId: bookingData.userId.trim(),
      restaurantId: bookingData.restaurantId.trim(),
      restaurantName: bookingData.restaurantName.trim(),
      date: bookingData.date.trim(),
      time: bookingData.time.trim(),
      guests: bookingData.guests,
      specialRequests: (bookingData.specialRequests || '').trim(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...booking,
      createdAt: Timestamp.fromDate(booking.createdAt),
      updatedAt: Timestamp.fromDate(booking.updatedAt),
    });
    
    return { id: docRef.id, ...booking };
  } catch (error) {
    console.error('Error creating booking:', error);
    if (error instanceof Error) {
      throw error; // Re-throw validation errors
    }
    throw new Error('Failed to create booking');
  }
};

export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  try {
    if (!bookingId?.trim()) {
      throw new Error('Booking ID is required');
    }

    const bookingRef = doc(db, 'bookings', bookingId.trim());
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      return null;
    }
    
    const data = bookingSnap.data();
    return {
      id: bookingSnap.id,
      userId: data.userId,
      restaurantId: data.restaurantId,
      restaurantName: data.restaurantName,
      date: data.date,
      time: data.time,
      guests: data.guests,
      specialRequests: data.specialRequests || '',
      status: data.status,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    if (!userId?.trim()) {
      throw new Error('User ID is required');
    }

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId.trim()),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        userId: data.userId,
        restaurantId: data.restaurantId,
        restaurantName: data.restaurantName,
        date: data.date,
        time: data.time,
        guests: data.guests,
        specialRequests: data.specialRequests || '',
        status: data.status,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });
    
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const updateBooking = async (
  bookingId: string, 
  updates: Partial<Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    if (!bookingId?.trim()) {
      throw new Error('Booking ID is required');
    }

    // If date is being updated, validate it
    if (updates.date) {
      const bookingDate = new Date(updates.date);
      if (isNaN(bookingDate.getTime())) {
        throw new Error('Invalid date format. Use YYYY-MM-DD');
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (bookingDate < today) {
        throw new Error('Booking date cannot be in the past');
      }
    }

    // If time is being updated, validate format
    if (updates.time) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(updates.time)) {
        throw new Error('Invalid time format. Use HH:MM (24-hour format)');
      }
    }

    // If guests is being updated, validate range
    if (updates.guests !== undefined) {
      if (!Number.isInteger(updates.guests) || updates.guests < 1 || updates.guests > 50) {
        throw new Error('Number of guests must be between 1 and 50');
      }
    }

    const bookingRef = doc(db, 'bookings', bookingId.trim());
    await updateDoc(bookingRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: string, 
  status: Booking['status']
): Promise<void> => {
  try {
    if (!bookingId?.trim()) {
      throw new Error('Booking ID is required');
    }

    const bookingRef = doc(db, 'bookings', bookingId.trim());
    await updateDoc(bookingRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  return updateBookingStatus(bookingId, 'cancelled');
};

export const confirmBooking = async (bookingId: string): Promise<void> => {
  return updateBookingStatus(bookingId, 'confirmed');
};

export const completeBooking = async (bookingId: string): Promise<void> => {
  return updateBookingStatus(bookingId, 'completed');
};

export const deleteBooking = async (bookingId: string): Promise<void> => {
  try {
    if (!bookingId?.trim()) {
      throw new Error('Booking ID is required');
    }

    await deleteDoc(doc(db, 'bookings', bookingId.trim()));
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

export const getBookingStats = async (userId: string) => {
  try {
    if (!userId?.trim()) {
      return { total: 0, upcoming: 0, completed: 0, cancelled: 0 };
    }

    const bookings = await getUserBookings(userId.trim());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = bookings.filter(b => {
      const bookingDate = new Date(b.date);
      return (b.status === 'pending' || b.status === 'confirmed') && 
             bookingDate >= today;
    });
    
    const completed = bookings.filter(b => b.status === 'completed');
    const cancelled = bookings.filter(b => b.status === 'cancelled');
    
    return {
      total: bookings.length,
      upcoming: upcoming.length,
      completed: completed.length,
      cancelled: cancelled.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
    };
  } catch (error) {
    console.error('Error getting booking stats:', error);
    return { 
      total: 0, 
      upcoming: 0, 
      completed: 0, 
      cancelled: 0,
      pending: 0,
      confirmed: 0 
    };
  }
};

// Get bookings by restaurant
export const getRestaurantBookings = async (restaurantId: string): Promise<Booking[]> => {
  try {
    if (!restaurantId?.trim()) {
      throw new Error('Restaurant ID is required');
    }

    const q = query(
      collection(db, 'bookings'),
      where('restaurantId', '==', restaurantId.trim()),
      orderBy('date', 'desc'),
      orderBy('time', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        userId: data.userId,
        restaurantId: data.restaurantId,
        restaurantName: data.restaurantName,
        date: data.date,
        time: data.time,
        guests: data.guests,
        specialRequests: data.specialRequests || '',
        status: data.status,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });
    
    return bookings;
  } catch (error) {
    console.error('Error fetching restaurant bookings:', error);
    throw error;
  }
};

// Get upcoming bookings for a user
export const getUpcomingBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const bookings = await getUserBookings(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return bookings.filter(b => {
      const bookingDate = new Date(b.date);
      return (b.status === 'pending' || b.status === 'confirmed') && 
             bookingDate >= today;
    }).sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA.getTime() - dateB.getTime(); // Sort by date/time ascending
    });
  } catch (error) {
    console.error('Error fetching upcoming bookings:', error);
    throw error;
  }
};