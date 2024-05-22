import { Router } from 'express';
import { loginUser, signupUser } from '../controllers/auth';
import { authenticateToken } from '../middleware/authenticate';

const router = Router();

// Login route
router.post('/login', loginUser);

// Signup route
router.post('/signup', authenticateToken, signupUser);

export default router;
