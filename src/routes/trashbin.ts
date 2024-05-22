import { Router } from 'express';
import {
  getAllTrashItems,
  getTrashItemById,
  createTrashItem,
  updateTrashItem,
} from '../controllers/trashbin';
import { authenticateToken } from '../middleware/authenticate';
const router = Router();

// Get a trash item by ID
router.get('/:id', authenticateToken, getTrashItemById);

// Get all trash items
router.get('/', authenticateToken, getAllTrashItems);

// Create a new trash item
router.post('/', authenticateToken, createTrashItem);

router.patch('/:id', authenticateToken, updateTrashItem);

export default router;
