import axios, { AxiosInstance } from 'axios';
import { AuthResponse, User, Property, Bid, Rental } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  register: async (email: string, password: string, firstName: string, lastName: string, role: string = 'buyer'): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { email, password, firstName, lastName, role });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// Property Services
export const propertyService = {
  getProperties: async (filters?: { city?: string; isAvailableForAuction?: boolean; isAvailableForRent?: boolean }): Promise<Property[]> => {
    const response = await api.get<Property[]>('/properties', { params: filters });
    return response.data;
  },

  getPropertyById: async (id: string): Promise<Property & { bids: Bid[] }> => {
    const response = await api.get<Property & { bids: Bid[] }>(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (property: Partial<Property>): Promise<Property> => {
    const response = await api.post<Property>('/properties', property);
    return response.data;
  },

  updateProperty: async (id: string, updates: Partial<Property>): Promise<Property> => {
    const response = await api.put<Property>(`/properties/${id}`, updates);
    return response.data;
  },

  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },
};

// Auction Services
export const auctionService = {
  placeBid: async (propertyId: string, amount: number): Promise<Bid> => {
    const response = await api.post<Bid>('/auctions/bids', { propertyId, amount });
    return response.data;
  },

  getBids: async (propertyId: string): Promise<Bid[]> => {
    const response = await api.get<Bid[]>(`/auctions/bids/${propertyId}`);
    return response.data;
  },

  getMyBids: async (): Promise<Bid[]> => {
    const response = await api.get<Bid[]>('/auctions/my-bids');
    return response.data;
  },
};

// Rental Services
export const rentalService = {
  createRental: async (propertyId: string, startDate: Date, endDate: Date): Promise<Rental> => {
    const response = await api.post<Rental>('/rentals', { propertyId, startDate, endDate });
    return response.data;
  },

  getRentals: async (filters?: { propertyId?: string }): Promise<Rental[]> => {
    const response = await api.get<Rental[]>('/rentals', { params: filters });
    return response.data;
  },

  getMyRentals: async (): Promise<Rental[]> => {
    const response = await api.get<Rental[]>('/rentals/my-rentals');
    return response.data;
  },

  updateRentalStatus: async (id: string, status: string): Promise<Rental> => {
    const response = await api.put<Rental>(`/rentals/${id}`, { status });
    return response.data;
  },
};
