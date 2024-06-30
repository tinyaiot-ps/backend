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
    const fillLevel = req.body.fillLevel;
    const fillLevelChange = req.body.fillLevelChange;
    const image = req.body.image;
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
        fillLevel: fillLevel || 0,
        fillLevelChange: fillLevelChange || 0,
        image: image || '',
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
        image,
      } = req.body;

      console.log('Trashcan name', trashcanName);

      if (longitude !== undefined && latitude !== undefined) {
        trashbin.coordinates = [longitude, latitude];
      }
      if (sensors !== undefined) {
        trashbin.sensors = sensors;
      }
      if (location !== undefined) {
        trashbin.location = location;
      }
      if (trashcanName !== undefined) {
        trashbin.name = trashcanName;
      }
      if (image !== undefined) {
        trashbin.image = image;
      }

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

export const getAllTrashItems = async (req: any, res: any, next: any) => {
  try {
    const projectQuery = req.query.project;
    let trashbins;
    let count;

    if (projectQuery) {
      // Check if the projectQuery is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(projectQuery)) {
        trashbins = await Trashbin.find({ project: projectQuery }).populate(
          'assignee'
        );
      } else {
        // If not a valid ObjectId, assume it's an identifier
        const project = await Project.findOne({ identifier: projectQuery });
        if (project) {
          trashbins = await Trashbin.find({ project: project._id }).populate(
            'assignee'
          );
        } else {
          return res.status(404).json({ message: 'Project not found' });
        }
      }
    } else {
      trashbins = await Trashbin.find().populate('assignee');
    }

    count = trashbins.length;

    return res.status(200).json({ count, trashbins });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addMultipleTrashItems = async (req: any, res: any, next: any) => {
  try {
    const projectId = '6680407ea37bcba951ad95e8';
    const signalStrength = 30;
    const trashbinData = [
      {
        id: 'laer-bin-0001',
        display: 'Rathaus',
        lat: 52.05564102823898,
        lng: 7.360054548481379,
        fill: 10,
        fillLevelChange: -50,
        battery: 100,
      },
      {
        id: 'laer-bin-0002',
        display: 'Eisdiele',
        lat: 52.054446369474086,
        lng: 7.357900783032656,
        fill: 20,
        fillLevelChange: -40,
        battery: 95,
      },
      {
        id: 'laer-bin-0003',
        display: 'Mock 1',
        lat: 52.05740200167625,
        lng: 7.358153181917018,
        fill: 30,
        fillLevelChange: -30,
        battery: 90,
      },
      {
        id: 'laer-bin-0004',
        display: 'Mock 2',
        lat: 52.05984470069173,
        lng: 7.354508167781202,
        fill: 40,
        fillLevelChange: -20,
        battery: 85,
      },
      {
        id: 'laer-bin-0005',
        display: 'Mock 3',
        lat: 52.05858758029923,
        lng: 7.348339576126552,
        fill: 50,
        fillLevelChange: -10,
        battery: 80,
      },
      {
        id: 'laer-bin-0006',
        display: 'Mock 4',
        lat: 52.056849321616546,
        lng: 7.348257774319442,
        fill: 60,
        fillLevelChange: 10,
        battery: 75,
      },
      {
        id: 'laer-bin-0007',
        display: 'Mock 5',
        lat: 52.05484146301711,
        lng: 7.344537017805167,
        fill: 70,
        fillLevelChange: 20,
        battery: 70,
      },
      {
        id: 'laer-bin-0008',
        display: 'Mock 6',
        lat: 52.053822275411655,
        lng: 7.350998965386141,
        fill: 80,
        fillLevelChange: 30,
        battery: 65,
      },
      {
        id: 'laer-bin-0009',
        display: 'Mock 7',
        lat: 52.05089302486732,
        lng: 7.356591490962451,
        fill: 90,
        fillLevelChange: 40,
        battery: 60,
      },
      {
        id: 'laer-bin-0010',
        display: 'Mock 8',
        lat: 52.052561689808336,
        lng: 7.359980721247052,
        fill: 100,
        fillLevelChange: 50,
        battery: 55,
      },
      {
        id: 'laer-bin-0012',
        display: 'Mock 9',
        lat: 52.049990684460234,
        lng: 7.36145800003346,
        fill: 10,
        fillLevelChange: -50,
        battery: 50,
      },
      {
        id: 'laer-bin-0011',
        display: 'Mock 10',
        lat: 52.050934789062104,
        lng: 7.364132550516044,
        fill: 20,
        fillLevelChange: -40,
        battery: 45,
      },
    ];

    const project = await Project.findById(projectId);

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
      for (const bin of trashbinData) {
        const identifier = await generateUniqueTrashbinIdentifier(projectId);

        const trashbin = new Trashbin({
          name: bin.display,
          identifier: identifier,
          coordinates: [bin.lat, bin.lng],
          location: '',
          project: projectId,
          signalStrength: signalStrength,
          batteryLevel: bin.battery,
          fillLevel: bin.fill,
          fillLevelChange: bin.fillLevelChange,
        });

        await trashbin.save();
      }

      return res
        .status(200)
        .json({ message: 'All trash bins created successfully' });
    } else {
      return res
        .status(403)
        .json({ message: 'Unauthorized to create trash bins' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
