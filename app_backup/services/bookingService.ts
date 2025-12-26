import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from .../app/config/firebase.;

export interface Booking {
  id?: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// SIMPLER VERSION: Accepts complete booking data
export const createBooking = async (bookingData: {
  userId: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}) => {
  try {
    const booking = {
      userId: bookingData.userId,
      restaurantId: `rest-${Date.now()}`,
      restaurantName: bookingData.restaurantName,
      date: bookingData.date,
      time: bookingData.time,
      guests: bookingData.guests,
      specialRequests: bookingData.specialRequests || '',
      status: 'pending' as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, 'bookings'), booking);
    return { id: docRef.id, ...booking };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getUserBookings = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId),
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
        specialRequests: data.specialRequests,
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

export const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string) => {
  return updateBookingStatus(bookingId, 'cancelled');
};

export const confirmBooking = async (bookingId: string) => {
  return updateBookingStatus(bookingId, 'confirmed');
};

export const completeBooking = async (bookingId: string) => {
  return updateBookingStatus(bookingId, 'completed');
};

export const deleteBooking = async (bookingId: string) => {
  try {
    await deleteDoc(doc(db, 'bookings', bookingId));
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

export const getBookingStats = async (userId: string) => {
  try {
    const bookings = await getUserBookings(userId);
    const upcoming = bookings.filter(b => 
      b.status === 'pending' || b.status === 'confirmed'
    );
    const completed = bookings.filter(b => b.status === 'completed');
    const cancelled = bookings.filter(b => b.status === 'cancelled');
    
    return {
      total: bookings.length,
      upcoming: upcoming.length,
      completed: completed.length,
      cancelled: cancelled.length,
    };
  } catch (error) {
    console.error('Error getting booking stats:', error);
    return { total: 0, upcoming: 0, completed: 0, cancelled: 0 };
  }
};
