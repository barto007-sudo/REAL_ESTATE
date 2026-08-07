import { Request, Response } from 'express';
import { query } from '../database/db';

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { city, isAvailableForAuction, isAvailableForRent } = req.query;

    let sql = `SELECT
      id,
      title,
      description,
      address,
      city,
      state,
      zipcode AS "zipCode",
      price,
      auctionstartdate AS "auctionStartDate",
      auctionenddate AS "auctionEndDate",
      rentalprice AS "rentalPrice",
      isavailableforrent AS "isAvailableForRent",
      isavailableforauction AS "isAvailableForAuction",
      ownerid AS "ownerId",
      createdat AS "createdAt",
      updatedat AS "updatedAt"
    FROM properties WHERE 1=1`;
    const params: any[] = [];

    if (city) {
      sql += ' AND city = $' + (params.length + 1);
      params.push(city);
    }

    if (isAvailableForAuction === 'true') {
      sql += ' AND isAvailableForAuction = true';
    }

    if (isAvailableForRent === 'true') {
      sql += ' AND isAvailableForRent = true';
    }

    sql += ' ORDER BY createdat DESC';

    const result = await query(sql, params);
    return res.json(result.rows);
  } catch (error) {
    console.error('Get properties error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT
        id,
        title,
        description,
        address,
        city,
        state,
        zipcode AS "zipCode",
        price,
        auctionstartdate AS "auctionStartDate",
        auctionenddate AS "auctionEndDate",
        rentalprice AS "rentalPrice",
        isavailableforrent AS "isAvailableForRent",
        isavailableforauction AS "isAvailableForAuction",
        ownerid AS "ownerId",
        createdat AS "createdAt",
        updatedat AS "updatedAt"
      FROM properties
      WHERE id = $1`,
      [id]
    );
    const property = result.rows[0];

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Get bids for this property
    const bidsResult = await query(
      `SELECT b.id, b.amount, u.firstname AS "firstName", u.lastname AS "lastName", b.createdat AS "createdAt" 
       FROM bids b 
       JOIN users u ON b.bidderid = u.id 
       WHERE b.propertyid = $1 
       ORDER BY b.amount DESC`,
      [id]
    );

    return res.json({ ...property, bids: bidsResult.rows });
  } catch (error) {
    console.error('Get property error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { title, description, address, city, state, zipCode, price, auctionStartDate, auctionEndDate, rentalPrice, isAvailableForRent, isAvailableForAuction } = req.body;

    if (!title || !description || !address || !city || !state || !zipCode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await query(
      `INSERT INTO properties 
       (title, description, address, city, state, zipcode, price, auctionstartdate, auctionenddate, rentalprice, isavailableforrent, isavailableforauction, ownerid)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING
       id,
       title,
       description,
       address,
       city,
       state,
       zipcode AS "zipCode",
       price,
       auctionstartdate AS "auctionStartDate",
       auctionenddate AS "auctionEndDate",
       rentalprice AS "rentalPrice",
       isavailableforrent AS "isAvailableForRent",
       isavailableforauction AS "isAvailableForAuction",
       ownerid AS "ownerId",
       createdat AS "createdAt",
       updatedat AS "updatedAt"`,
      [title, description, address, city, state, zipCode, price, auctionStartDate || null, auctionEndDate || null, rentalPrice || null, isAvailableForRent || false, isAvailableForAuction || false, req.user.id]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create property error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { title, description, address, city, state, zipCode, auctionStartDate, auctionEndDate, rentalPrice, isAvailableForRent, isAvailableForAuction } = req.body;

    // Check if user owns the property
    const propertyResult = await query('SELECT ownerid FROM properties WHERE id = $1', [id]);
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (propertyResult.rows[0].ownerid !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to update this property' });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (address !== undefined) {
      updates.push(`address = $${paramCount++}`);
      values.push(address);
    }
    if (city !== undefined) {
      updates.push(`city = $${paramCount++}`);
      values.push(city);
    }
    if (state !== undefined) {
      updates.push(`state = $${paramCount++}`);
      values.push(state);
    }
    if (zipCode !== undefined) {
      updates.push(`zipcode = $${paramCount++}`);
      values.push(zipCode);
    }
    if (auctionStartDate !== undefined) {
      updates.push(`auctionstartdate = $${paramCount++}`);
      values.push(auctionStartDate);
    }
    if (auctionEndDate !== undefined) {
      updates.push(`auctionenddate = $${paramCount++}`);
      values.push(auctionEndDate);
    }
    if (rentalPrice !== undefined) {
      updates.push(`rentalprice = $${paramCount++}`);
      values.push(rentalPrice);
    }
    if (isAvailableForRent !== undefined) {
      updates.push(`isavailableforrent = $${paramCount++}`);
      values.push(isAvailableForRent);
    }
    if (isAvailableForAuction !== undefined) {
      updates.push(`isavailableforauction = $${paramCount++}`);
      values.push(isAvailableForAuction);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updates.push(`updatedat = $${paramCount++}`);
    values.push(new Date());
    values.push(id);

    const sql = `UPDATE properties SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING
      id,
      title,
      description,
      address,
      city,
      state,
      zipcode AS "zipCode",
      price,
      auctionstartdate AS "auctionStartDate",
      auctionenddate AS "auctionEndDate",
      rentalprice AS "rentalPrice",
      isavailableforrent AS "isAvailableForRent",
      isavailableforauction AS "isAvailableForAuction",
      ownerid AS "ownerId",
      createdat AS "createdAt",
      updatedat AS "updatedAt"`;
    const result = await query(sql, values);

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Update property error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;

    // Check if user owns the property
    const propertyResult = await query('SELECT ownerid FROM properties WHERE id = $1', [id]);
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (propertyResult.rows[0].ownerid !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to delete this property' });
    }

    await query('DELETE FROM bids WHERE propertyid = $1', [id]);
    await query('DELETE FROM rentals WHERE propertyid = $1', [id]);
    await query('DELETE FROM properties WHERE id = $1', [id]);

    return res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
