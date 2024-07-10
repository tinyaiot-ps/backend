import { History } from '../models/history';
import { Sensor } from '../models/sensor';
import { Project } from '../models/project';

export const addNoiseHistory = async (req: any, res: any, next: any) => {
  try {
    const { projectId, sensorId, prediction, value } = req.body;

    // For now always send the projectId as 668e605974f99f35291be526
    // For now always send the sensorId as 668e92ca094613ff3bade435

    // Check if the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project does not exist' });
    }

    // Check if the sensor exists
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor does not exist' });
    }

    // Create the history object
    const history = new History({
      sensor: sensorId,
      measureType: 'noise_level',
      noisePrediction: prediction.toString(),
      measurement: value,
    });

    // Save the history object
    await history.save();

    // Push the history ID to the sensor's history array
    sensor.history.push(history._id);
    await sensor.save();

    // Also push the history ref to the sensors
    return res
      .status(201)
      .json({ message: 'Noise history added successfully!', history });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNoiseSensorHistoryBySensorId = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const { sensorId } = req.params;

    // Check if the sensor exists
    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor does not exist' });
    }

    // Get all histories for the sensor and populate the sensor field
    const histories = await History.find({ sensor: sensorId });

    return res.status(200).json({ histories });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
