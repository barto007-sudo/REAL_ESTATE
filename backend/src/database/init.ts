import { query } from './db';

export const initializeDatabase = async () => {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'seller', 'buyer')),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create properties table
    await query(`
      CREATE TABLE IF NOT EXISTS properties (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zipCode VARCHAR(20) NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        auctionStartDate TIMESTAMP,
        auctionEndDate TIMESTAMP,
        rentalPrice DECIMAL(10, 2),
        isAvailableForRent BOOLEAN DEFAULT FALSE,
        isAvailableForAuction BOOLEAN DEFAULT FALSE,
        ownerId UUID NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ownerId) REFERENCES users(id)
      );
    `);

    // Create bids table
    await query(`
      CREATE TABLE IF NOT EXISTS bids (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        propertyId UUID NOT NULL,
        bidderId UUID NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (propertyId) REFERENCES properties(id),
        FOREIGN KEY (bidderId) REFERENCES users(id)
      );
    `);

    // Create rentals table
    await query(`
      CREATE TABLE IF NOT EXISTS rentals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        propertyId UUID NOT NULL,
        tenantId UUID NOT NULL,
        startDate TIMESTAMP NOT NULL,
        endDate TIMESTAMP NOT NULL,
        monthlyPrice DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'pending', 'completed', 'cancelled')),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (propertyId) REFERENCES properties(id),
        FOREIGN KEY (tenantId) REFERENCES users(id)
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
