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
exports.getNoiseSensorHistoryBySensorId = exports.addNoiseHistory = void 0;
const history_1 = require("../models/history");
const sensor_1 = require("../models/sensor");
const project_1 = require("../models/project");
const addNoiseHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId, sensorId, prediction, value } = req.body;
        // For now always send the projectId as 6681292999d92893669ea287
        // For now always send the sensorId as "668945bfbc487cfc392c0068"
        // Check if the project exists
        const project = yield project_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project does not exist' });
        }
        // Check if the sensor exists
        const sensor = yield sensor_1.Sensor.findById(sensorId);
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor does not exist' });
        }
        // Create the history object
        const history = new history_1.History({
            sensor: sensorId,
            measureType: 'noise_level',
            noisePrediction: prediction.toString(),
            measurement: value,
        });
        // Save the history object
        yield history.save();
        // Push the history ID to the sensor's history array
        sensor.history.push(history._id);
        yield sensor.save();
        // Also push the history ref to the sensors
        return res
            .status(201)
            .json({ message: 'Noise history added successfully!', history });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addNoiseHistory = addNoiseHistory;
const getNoiseSensorHistoryBySensorId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sensorId } = req.params;
        // Check if the sensor exists
        const sensor = yield sensor_1.Sensor.findById(sensorId);
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor does not exist' });
        }
        // Get all histories for the sensor and populate the sensor field
        const histories = yield history_1.History.find({ sensor: sensorId });
        return res.status(200).json({ histories });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getNoiseSensorHistoryBySensorId = getNoiseSensorHistoryBySensorId;
