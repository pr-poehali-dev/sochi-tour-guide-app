export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  preferences?: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  activities: string[];
  budget: 'economy' | 'medium' | 'premium';
  travelStyle: 'family' | 'romantic' | 'active' | 'relaxing';
}

export interface Hotel {
  id: number;
  name: string;
  rating: number;
  price: number;
  image: string;
  images?: string[];
  location: string;
  address?: string;
  district: string;
  amenities: string[];
  amenitiesDisplay: string[];
  description?: string;
  coords: [number, number];
  stars?: number;
  type?: 'hotel' | 'apartment' | 'guesthouse' | 'resort';
  rooms?: HotelRoom[];
  reviews?: Review[];
  cancelPolicy?: string;
  fullDescription?: string;
  highlights?: string[];
  services?: string[];
  nearbyAttractions?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
}

export interface HotelRoom {
  id?: string;
  type: string;
  name?: string;
  price?: number;
  area?: number;
  capacity?: number;
  amenities?: string[];
  images?: string[];
  description: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  stayDate: string;
  photos?: string[];
  pros: string;
  cons: string;
  ratings: {
    cleanliness: number;
    service: number;
    location: number;
    wifi: number;
  };
}

export interface Booking {
  id: string;
  hotelId: number;
  hotelName: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  mealPlan: 'none' | 'breakfast' | 'halfBoard' | 'fullBoard';
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  createdAt: string;
  specialRequests?: string;
}

export interface Attraction {
  id: number;
  name: string;
  category: string;
  rating: number;
  image: string;
  images?: string[];
  description: string;
  tags: string[];
  coords: [number, number];
  fullDescription?: string;
  workingHours?: string;
  ticketPrice?: string;
  highlights?: string[];
  bestTime?: string;
  duration?: string;
  price?: string;
  tips?: string[];
}