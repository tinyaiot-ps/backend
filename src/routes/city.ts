import { Router } from 'express';
import { getCityById, getAllCities, createCity } from '../controllers/city';
import { authenticateToken } from '../middleware/authenticate';

const router = Router();

// Get a city by ID
router.get('/:id', authenticateToken, getCityById);

// Get all cities, with optional filters
router.get('/', authenticateToken, getAllCities);

// Create a new city
router.post('/', authenticateToken, createCity);

export default router;
