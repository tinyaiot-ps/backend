import { Project } from '../models/project';
import { City } from '../models/city';
import { User } from '../models/user';

// Get all projects
export const getAllProjects = async (req: any, res: any) => {
  try {
    const projects = await Project.find();
    res.json({
      projects,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single project by ID
export const getProjectById = async (req: any, res: any) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ project });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req: any, res: any) => {
  try {
    // Check if the user has superadmin role
    if (req.user.role !== 'SUPERADMIN') {
      return res.status(403).send('Only superadmin can create new projects');
    }

    // Check if a project with the same name already exists
    const existingProject = await Project.findOne({ name: req.body.name });
    if (existingProject) {
      return res
        .status(409)
        .json({ message: 'Project with this name already exists' });
    }

    // Check if the city exists
    const cityExists = await City.findById(req.body.city);
    if (!cityExists) {
      return res.status(404).json({ message: 'City not found' });
    }

    // Check if all users exist
    const userIds = req.body.users;
    for (const userId of userIds) {
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }
    }

    // Create and save the new project
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res
      .status(201)
      .json({ message: 'Project created succesfully!', savedProject });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProject = async (req: any, res: any) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is authorized to update the project
    const userId = req.user.id; // Assuming user id is stored in req.user
    const userRole = req.user.role;

    if (userRole !== 'SUPERADMIN' && !project.users.includes(userId)) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to edit this project' });
    }

    // Check if the city exists
    const cityExists = await City.findById(req.body.city);
    if (!cityExists) {
      return res.status(404).json({ message: 'City not found' });
    }

    // Check if all users exist
    const userIds = req.body.users;
    for (const userId of userIds) {
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProject);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
