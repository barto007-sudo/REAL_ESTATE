import { Request, Response } from 'express';
import { query } from '../database/db';

export const createRental = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { propertyId, startDate, endDate } = req.body;

    if (!propertyId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if property exists and is available for rent
    const propertyResult = await query('SELECT * FROM properties WHERE id = $1', [propertyId]);
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const property = propertyResult.rows[0];
    if (!property.isavailableforrent) {
      return res.status(400).json({ message: 'Property is not available for rent' });
    }

    // Check for overlapping rentals
    const conflictResult = await query(
      `SELECT * FROM rentals WHERE propertyid = $1 AND status != 'cancelled' AND
       ((startDate <= $2 AND endDate >= $3) OR
        (startDate <= $3 AND endDate >= $2))`,
      [propertyId, new Date(startDate), new Date(endDate)]
    );

    if (conflictResult.rows.length > 0) {
      return res.status(400).json({ message: 'Property is not available for the requested dates' });
    }

    // Create rental
    const result = await query(
      `INSERT INTO rentals (propertyid, tenantid, startdate, enddate, monthlyprice, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING id, propertyid AS "propertyId", tenantid AS "tenantId", startdate AS "startDate", enddate AS "endDate", monthlyprice AS "monthlyPrice", status, createdat AS "createdAt", updatedat AS "updatedAt"`,
      [propertyId, req.user.id, new Date(startDate), new Date(endDate), property.rentalprice]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create rental error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getRentals = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.query;

    let sql = `SELECT
      id,
      propertyid AS "propertyId",
      tenantid AS "tenantId",
      startdate AS "startDate",
      enddate AS "endDate",
      monthlyprice AS "monthlyPrice",
      status,
      createdat AS "createdAt",
      updatedat AS "updatedAt"
    FROM rentals WHERE 1=1`;
    const params: any[] = [];

    if (propertyId) {
      sql += ' AND propertyid = $' + (params.length + 1);
      params.push(propertyId);
    }

    const result = await query(sql, params);
    return res.json(result.rows);
  } catch (error) {
    console.error('Get rentals error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMyRentals = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const result = await query(
      `SELECT
        r.id,
        r.propertyid AS "propertyId",
        r.tenantid AS "tenantId",
        r.startdate AS "startDate",
        r.enddate AS "endDate",
        r.monthlyprice AS "monthlyPrice",
        r.status,
        r.createdat AS "createdAt",
        r.updatedat AS "updatedAt",
        p.title,
        p.city,
        p.address
       FROM rentals r 
       JOIN properties p ON r.propertyid = p.id 
       WHERE r.tenantid = $1 
       ORDER BY r.createdat DESC`,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Get my rentals error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateRentalStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if user is the property owner or admin
    const rentalResult = await query(
      'SELECT r.id, p.ownerid FROM rentals r JOIN properties p ON r.propertyid = p.id WHERE r.id = $1',
      [id]
    );

    if (rentalResult.rows.length === 0) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    if (rentalResult.rows[0].ownerid !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to update this rental' });
    }

    const result = await query(
      'UPDATE rentals SET status = $1, updatedat = $2 WHERE id = $3 RETURNING id, propertyid AS "propertyId", tenantid AS "tenantId", startdate AS "startDate", enddate AS "endDate", monthlyprice AS "monthlyPrice", status, createdat AS "createdAt", updatedat AS "updatedAt"',
      [status, new Date(), id]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Update rental status error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
