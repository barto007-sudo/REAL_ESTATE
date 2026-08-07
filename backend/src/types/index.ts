export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'seller' | 'buyer';
  createdAt: Date;
  updatedAt: Date;
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
  auctionStartDate: Date;
  auctionEndDate: Date;
  rentalPrice: number | null;
  isAvailableForRent: boolean;
  isAvailableForAuction: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bid {
  id: string;
  propertyId: string;
  bidderId: string;
  amount: number;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}
