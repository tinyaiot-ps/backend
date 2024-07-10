"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryBySensorId = exports.postHistory = void 0;
const history_1 = require("../models/history");
// const noiseData = require('./noiseHistory.json');
// Define the route controller function to handle posting history data
const postHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        res.status(500).send('Server error');
    }
});
exports.postHistory = postHistory;
const getHistoryBySensorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sensorId = req.params.sensorId;
    const { measureType } = req.query;
    let filter = { sensor: sensorId };
    if (measureType && measureType !== 'all') {
        filter = Object.assign(Object.assign({}, filter), { measureType: measureType });
    }
    try {
        const history = yield history_1.History.find(filter);
        res.status(200).json(history);
    }
    catch (error) {
        res.status(500).send('Server error');
    }
});
exports.getHistoryBySensorId = getHistoryBySensorId;
