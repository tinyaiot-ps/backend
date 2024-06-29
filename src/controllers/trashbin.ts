import { generateUniqueTrashbinIdentifier } from '../service/trashbin';
import { Project } from '../models/project';
import { Trashbin } from '../models/trashbin';
import mongoose from 'mongoose';

export const createTrashItem = async (req: any, res: any, next: any) => {
  try {
    const projectId = req.body.project;
    const trashcanName = req.body.name;
    const longitude = req.body.longitude;
    const latitude = req.body.latitude;
    const signalStrength = req.body.signalStrength;
    const batteryLevel = req.body.batteryLevel;
    const project = await Project.findById(projectId);

    if (!trashcanName) {
      return res.status(400).json({ message: 'Trashcan name is required' });
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    if (
      userRole === 'SUPERADMIN' ||
      (userRole === 'ADMIN' && project.users.includes(userId)) ||
      (userRole === 'USER' && project.users.includes(userId))
    ) {
      //   Create the trashbin here

      const identifer = await generateUniqueTrashbinIdentifier(projectId);

      // Fetch location string from the longitude and latitude

      const trashbin = new Trashbin({
        name: trashcanName,
        identifier: identifer,
        coordinates: [longitude, latitude],
        location: '',
        project: projectId,
        signalStrength: signalStrength || 0,
        batteryLevel: batteryLevel !== undefined ? batteryLevel : 100,
      });

      await trashbin.save();
      return res
        .status(200)
        .json({ message: 'Trash can created successfully' });
    } else {
      return res
        .status(403)
        .json({ message: 'Unauthorized to create trash can' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update the trash item
export const updateTrashItem = async (req: any, res: any, next: any) => {
  try {
    const trashbinId = req.params.id;
    const trashbin = await Trashbin.findById(trashbinId);

    if (!trashbin) {
      return res.status(404).json({ message: 'Trashbin not found' });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    const project: any = await Project.findById(trashbin.project);

    if (
      userRole === 'SUPERADMIN' ||
      (userRole === 'ADMIN' && project.users.includes(userId)) ||
      (userRole === 'USER' && project.users.includes(userId))
    ) {
      // Update the trashbin here

      const {
        longitude,
        latitude,
        sensors,
        location,
        name: trashcanName,
        signalStrength,
        batteryLevel,
      } = req.body;

      trashbin.coordinates = [longitude, latitude];
      trashbin.sensors = sensors;
      trashbin.location = location;
      trashbin.name = trashcanName;
      if (signalStrength !== undefined) {
        trashbin.signalStrength = signalStrength;
      }

      if (batteryLevel !== undefined) {
        trashbin.batteryLevel = batteryLevel; // Added batteryLevel
      }

      await trashbin.save();
      return res
        .status(200)
        .json({ message: 'Trash can updated successfully' });
    } else {
      return res
        .status(403)
        .json({ message: 'Unauthorized to update trash can' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrashItemById = async (req: any, res: any, next: any) => {
  try {
    const trashbinId = req.params.id;
    let trashbin;

    if (mongoose.Types.ObjectId.isValid(trashbinId)) {
      trashbin = await Trashbin.findById(trashbinId).populate('assignee');
    } else {
      trashbin = await Trashbin.findOne({ identifier: trashbinId }).populate(
        'assignee'
      );
    }

    if (!trashbin) {
      return res.status(404).json({ message: 'Trashbin not found' });
    }

    return res.status(200).json(trashbin);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all trash items
export const getAllTrashItems = async (req: any, res: any, next: any) => {
  try {
    const trashbins = await Trashbin.find().populate('assignee');
    return res.status(200).json(trashbins);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
