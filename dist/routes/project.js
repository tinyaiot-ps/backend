"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_1 = require("../controllers/project");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// Get a project by ID
router.get('/:id', authenticate_1.authenticateToken, project_1.getProjectById);
// Get all projects, with optional filters
router.get('/', authenticate_1.authenticateToken, project_1.getAllProjects);
// Create a new project
router.post('/', authenticate_1.authenticateToken, project_1.createProject);
// Update a project by ID
router.patch('/:id', authenticate_1.authenticateToken, project_1.updateProject);
// temp script route
exports.default = router;
