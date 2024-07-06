import { Router } from 'express';
import {
  addNoiseHistory,
  getNoiseSensorHistoryBySensorId,
} from '../controllers/noise';
import {
  authenticateNoise,
  authenticateToken,
} from '../middleware/authenticate';
const router = Router();

// Add history for noise
router.post('/history', authenticateNoise, addNoiseHistory);

router.get(
  '/history/sensor/:sensorId',
  authenticateToken,
  getNoiseSensorHistoryBySensorId
);

export default router;
