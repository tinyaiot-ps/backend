"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middleware/authenticate");
const sensor_1 = require("../controllers/sensor");
const router = express_1.default.Router();
// GET ALL sensors
router.get('/', authenticate_1.authenticateToken, sensor_1.getAllSensors); // Controller logic for getting all sensors goes here
// GET sensor by id
router.get('/:id', authenticate_1.authenticateToken, sensor_1.getSensorById);
// POST sensor
router.post('/', authenticate_1.authenticateToken, sensor_1.postSensor);
exports.default = router;
