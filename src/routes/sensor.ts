import express from 'express';
import { authenticateToken } from '../middleware/authenticate';

import {
  getAllSensors,
  getSensorById,
  postSensor,
} from '../controllers/sensor';

const router = express.Router();

// GET ALL sensors
router.get('/sensors', authenticateToken, getAllSensors); // Controller logic for getting all sensors goes here

// GET sensor by id
router.get('/sensors/:id', authenticateToken, getSensorById);

// POST sensor
router.post('/sensors', authenticateToken, postSensor);

export default router;
