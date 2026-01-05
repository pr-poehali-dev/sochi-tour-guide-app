import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Booking } from '@/types';
import { useAuth } from './AuthContext';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'userId' | 'createdAt'>) => string;
  cancelBooking: (bookingId: string) => void;
  getUserBookings: () => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const savedBookings = localStorage.getItem('sochi-bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('sochi-bookings', JSON.stringify(newBookings));
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'userId' | 'createdAt'>) => {
    const bookingId = `SOCHI-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newBooking: Booking = {
      ...booking,
      id: bookingId,
      userId: user?.id || 'guest',
      createdAt: new Date().toISOString(),
    };

    saveBookings([...bookings, newBooking]);
    return bookingId;
  };

  const cancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
    );
    saveBookings(updatedBookings);
  };

  const getUserBookings = () => {
    if (!user) return [];
    return bookings.filter(b => b.userId === user.id);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking, getUserBookings }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
