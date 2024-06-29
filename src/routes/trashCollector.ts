import { Router } from 'express';
import {
  createTrashCollector,
  assignTrashbinsToTrashCollector,
} from '../controllers/trashCollector';
import { authenticateToken } from '../middleware/authenticate';
const router = Router();

router.post('/', authenticateToken, createTrashCollector);

router.post('/assign', authenticateToken, assignTrashbinsToTrashCollector);

export default router;
