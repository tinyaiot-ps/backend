import { History } from '../models/history';
import { Sensor } from '../models/sensor';
// const noiseData = require('./noiseHistory.json');

// Define the route controller function to handle posting history data
export const postHistory = async (req: any, res: any) => {
  try {
    // const fillLevelSensorId = '668e6979f3b1e021dfba6aed';
    // const batteryLevelSensorId = '668e69a3f3b1e021dfba6af3';
    // const noiseSensorId = '668e6b79e921750c7a2fe08d';

    // const noiseSensor = await Sensor.findOne({ _id: noiseSensorId });

    // for (const data of noiseData) {
    //   if (data.noise_level !== undefined) {
    //     console.log('Coming inside noise level ===>');
    //     if (noiseSensor) {
    //       const newHistory = new History({
    //         sensor: noiseSensor._id,
    //         measureType: 'noise_level',
    //         measurement: data.noise_level,
    //       });
    //       await newHistory.save();
    //       noiseSensor.history.push(newHistory._id);
    //       await noiseSensor.save();
    //     }
    //   }
    // }

    res.status(201).json({
      message: 'success',
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
};

export const getHistoryBySensorId = async (req: any, res: any) => {
  const sensorId = req.params.sensorId;
  const { measureType } = req.query;
  let filter: any = { sensor: sensorId };

  if (measureType && measureType !== 'all') {
    filter = { ...filter, measureType: measureType };
  }

  try {
    const history = await History.find(filter);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).send('Server error');
  }
};
