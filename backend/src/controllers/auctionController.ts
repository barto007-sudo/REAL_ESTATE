import { Request, Response } from 'express';
import { query } from '../database/db';

export const placeBid = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { propertyId, amount } = req.body;

    if (!propertyId || !amount) {
      return res.status(400).json({ message: 'Missing propertyId or amount' });
    }

    // Check if property exists and is available for auction
    const propertyResult = await query('SELECT * FROM properties WHERE id = $1', [propertyId]);
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const property = propertyResult.rows[0];
    if (!property.isAvailableForAuction) {
      return res.status(400).json({ message: 'Property is not available for auction' });
    }

    // Check if auction is still active
    const now = new Date();
    if (now > property.auctionEndDate) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Get highest bid
    const highestBidResult = await query(
      'SELECT amount FROM bids WHERE propertyId = $1 ORDER BY amount DESC LIMIT 1',
      [propertyId]
    );

    const highestBid = highestBidResult.rows[0]?.amount || property.price;

    if (amount <= highestBid) {
      return res.status(400).json({ message: 'Bid must be higher than current highest bid' });
    }

    // Place bid
    const result = await query(
      'INSERT INTO bids (propertyId, bidderId, amount) VALUES ($1, $2, $3) RETURNING *',
      [propertyId, req.user.id, amount]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Place bid error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getBids = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;

    const result = await query(
      `SELECT b.id, b.amount, u.firstName, u.lastName, b.createdAt 
       FROM bids b 
       JOIN users u ON b.bidderId = u.id 
       WHERE b.propertyId = $1 
       ORDER BY b.amount DESC`,
      [propertyId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Get bids error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMyBids = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const result = await query(
      `SELECT b.id, b.amount, p.title, p.city, b.createdAt 
       FROM bids b 
       JOIN properties p ON b.propertyId = p.id 
       WHERE b.bidderId = $1 
       ORDER BY b.createdAt DESC`,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Get my bids error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
