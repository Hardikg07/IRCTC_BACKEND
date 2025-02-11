import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Book a seat
router.post('/',authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { train_id } = req.body;
    const user_id = req.user.id;
    
    // Check seat availability with FOR UPDATE to lock the row
    const trainResult = await client.query(
      'SELECT available_seats FROM trains WHERE id = $1 FOR UPDATE',
      [train_id]
    );
    
    if (trainResult.rows[0].available_seats <= 0) {
      throw new Error('No seats available');
    }
    
    // Create booking
    const bookingResult = await client.query(
      'INSERT INTO bookings (user_id, train_id, booking_date) VALUES ($1, $2, NOW()) RETURNING *',
      [user_id, train_id]
    );
    
    // Update available seats
    await client.query(
      'UPDATE trains SET available_seats = available_seats - 1 WHERE id = $1',
      [train_id]
    );
    
    await client.query('COMMIT');
    res.status(201).json(bookingResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Get booking details
router.get('/:id',authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, t.name as train_name, t.source, t.destination 
       FROM bookings b 
       JOIN trains t ON b.train_id = t.id 
       WHERE b.id = $1 AND b.user_id = $2`,
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;