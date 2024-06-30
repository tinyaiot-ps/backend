import { Project } from '../models/project';
import { City } from '../models/city';
import { User } from '../models/user';

import { generateUniqueProjectIdentifier } from '../service';
import mongoose from 'mongoose';

// Get all projects a user is part of
export const getAllProjects = async (req: any, res: any) => {
  try {
    const userId = req.user.id; // Assuming user id is stored in req.user
    const userRole = req.user.role;

    let projects;
    if (userRole === 'SUPERADMIN') {
      projects = await Project.find();
    } else {
      projects = await Project.find({ users: userId });
    }

    res.json({
      projectCount: projects?.length,
      projects,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single project by ID
export const getProjectById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    let project;

    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findById(id);
    } else {
      project = await Project.findOne({ identifier: id });
    }

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

    const projectIdentifer = await generateUniqueProjectIdentifier(
      req.body.city
    );

    // Create and save the new project
    const newProject = new Project({
      ...req.body,
      identifier: projectIdentifer,
    });
    const savedProject = await newProject.save();

    // Once the project is create we need to push the projectId to the added users user.projects array
    savedProject.users.forEach(async (userId: any) => {
      const user: any = await User.findById(userId);
      user.projects.push(savedProject._id);
      await user.save();
    });

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

    if (req.body.city) {
      // Check if the city exists
      const cityExists = await City.findById(req.body.city);
      if (!cityExists) {
        return res.status(404).json({ message: 'City not found' });
      }
    }

    if (req?.body?.users?.length > 0) {
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
    }

    const updatedProject: any = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (updatedProject.users?.length > 0) {
      updatedProject.users.forEach(async (userId: any) => {
        const user: any = await User.findById(userId);
        if (!user.projects.includes(updatedProject._id)) {
          user.projects.push(updatedProject._id);
          await user.save();
        }
      });
    }

    res.json(updatedProject);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
