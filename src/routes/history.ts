import { Router } from 'express';
import { postHistory, getHistoryBySensorId } from '../controllers/history';
import { authenticateToken } from '../middleware/authenticate';

const router = Router();

// History JSON dump script
router.post('/', authenticateToken, postHistory);

router.get('/sensor/:sensorId', getHistoryBySensorId);

export default router;
