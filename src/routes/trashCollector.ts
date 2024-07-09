import { Router } from 'express';
import {
  createTrashCollector,
  assignTrashbinsToTrashCollector,
  testHistory,
} from '../controllers/trashCollector';
import { authenticateToken } from '../middleware/authenticate';
const router = Router();

router.post('/', authenticateToken, createTrashCollector);

router.post('/assign', authenticateToken, assignTrashbinsToTrashCollector);

router.get('/history', testHistory);

export default router;
