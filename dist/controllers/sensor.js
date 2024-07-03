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
exports.postSensor = exports.getSensorById = exports.getAllSensors = void 0;
const trashbin_1 = require("../models/trashbin");
const sensor_1 = require("../models/sensor");
const getAllSensors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Implement logic to get all sensors
        const sensors = yield sensor_1.Sensor.find().populate('trashbin');
        // .populate('history');
        res.status(200).json(sensors);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllSensors = getAllSensors;
const getSensorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const sensor = yield sensor_1.Sensor.findById(id)
            .populate('trashbin')
            .populate('history');
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }
        res.status(200).json(sensor);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSensorById = getSensorById;
const postSensor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trashbinID, measureType, applianceType } = req.body;
        const userID = req.user.id;
        const userRole = req.user.role;
        if (!trashbinID) {
            return res.status(400).json({ message: 'Trashbin ID is required' });
        }
        const trashbin = yield trashbin_1.Trashbin.findById(trashbinID).populate({
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
        const project = trashbin.project;
        const isUserInProject = project.users.some((user) => user._id.toString() === userID.toString());
        if (!isUserInProject && userRole !== 'SUPERADMIN') {
            return res
                .status(403)
                .json({ message: 'User does not have access to this project' });
        }
        const newSensor = new sensor_1.Sensor({
            trashbin: trashbinID,
            measureType,
            applianceType,
        });
        yield newSensor.save();
        // Push the new sensor ID into the trashbin.sensors array
        trashbin.sensors.push(newSensor._id);
        yield trashbin.save();
        return res
            .status(200)
            .json({ message: 'Sensor created successfully', newSensor });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.postSensor = postSensor;
