import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
} from '../controllers/project';
import { authenticateToken } from '../middleware/authenticate';
const router = Router();

// Get a project by ID
router.get('/:id', authenticateToken, getProjectById);

// Get all projects, with optional filters
router.get('/', authenticateToken, getAllProjects);

// Create a new project
router.post('/', authenticateToken, createProject);

// Update a project by ID
router.patch('/:id', authenticateToken, updateProject);

export default router;
