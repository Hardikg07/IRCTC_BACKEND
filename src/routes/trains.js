import express from 'express';
import pool from '../config/db.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Add new train (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, source, destination, total_seats } = req.body;
    
    const result = await pool.query(
      'INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES ($1, $2, $3, $4, $4) RETURNING *',
      [name, source, destination, total_seats]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get seat availability
router.get('/availability', async (req, res) => {
  try {
    const { source, destination } = req.query;
    
    const result = await pool.query(
      'SELECT * FROM trains WHERE source = $1 AND destination = $2',
      [source, destination]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;