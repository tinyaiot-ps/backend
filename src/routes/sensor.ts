import express from 'express';
import { authenticateToken } from '../middleware/authenticate';

import {
  getAllSensors,
  getSensorById,
  postSensor,
} from '../controllers/sensor';

const router = express.Router();

// GET ALL sensors
router.get('/', authenticateToken, getAllSensors); // Controller logic for getting all sensors goes here

// GET sensor by id
router.get('/:id', authenticateToken, getSensorById);

// POST sensor
router.post('/', authenticateToken, postSensor);

export default router;
