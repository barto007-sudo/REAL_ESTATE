export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'seller' | 'buyer';
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  auctionStartDate?: Date;
  auctionEndDate?: Date;
  rentalPrice?: number;
  isAvailableForRent: boolean;
  isAvailableForAuction: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  bids?: Bid[];
}

export interface Bid {
  id: string;
  amount: number;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
}

export interface Rental {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  monthlyPrice: number;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  title?: string;
  city?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}
