import { Router } from 'express';
import { loginUser, signupUser } from '../controllers/auth';

const router = Router();

// Login route
router.post('/login', loginUser);

// Signup route
router.post('/signup', signupUser);

export default router;
