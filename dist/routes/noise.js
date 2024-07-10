"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noise_1 = require("../controllers/noise");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// Add history for noise
router.post('/history', authenticate_1.authenticateNoise, noise_1.addNoiseHistory);
router.get('/history/sensor/:sensorId', authenticate_1.authenticateToken, noise_1.getNoiseSensorHistoryBySensorId);
exports.default = router;
