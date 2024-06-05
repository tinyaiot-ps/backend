import { Trashbin } from '../models/trashbin';
import { Project } from '../models/project';
import { Sensor } from '../models/sensor';

export const getAllSensors = async (req: any, res: any, next: any) => {
  try {
    // Implement logic to get all sensors

    const sensors = await Sensor.find()
      .populate('trashbin')
      .populate('history');
    res.status(200).json(sensors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSensorById = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;
    const sensor = await Sensor.findById(id)
      .populate('trashbin')
      .populate('history');
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }
    res.status(200).json(sensor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const postSensor = async (req: any, res: any, next: any) => {
  try {
    const { trashbinID, measure } = req.body;
    const userID = req.user._id;

    if (!trashbinID) {
      return res.status(400).json({ message: 'Trashbin ID is required' });
    }

    const trashbin = await Trashbin.findById(trashbinID).populate({
      path: 'project',
      populate: {
        path: 'users',
      },
    });
    if (!trashbin) {
      return res.status(404).json({ message: 'Trashbin not found' });
    }

    if (!trashbin.project) {
      return res
        .status(404)
        .json({ message: 'No project associated with this trashbin' });
    }

    const project = trashbin.project as unknown as { users: { _id: string }[] };

    const isUserInProject = project.users.some(
      (user) => user._id.toString() === userID.toString()
    );

    if (!isUserInProject) {
      return res
        .status(403)
        .json({ message: 'User does not have access to this project' });
    }

    const newSensor = new Sensor({
      trashbin: trashbinID,
      measure,
    });

    await newSensor.save();

    return res
      .status(200)
      .json({ message: 'Sensor created successfully', newSensor });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
