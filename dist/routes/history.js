"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const history_1 = require("../controllers/history");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// History JSON dump script
router.post('/', authenticate_1.authenticateToken, history_1.postHistory);
router.get('/sensor/:sensorId', history_1.getHistoryBySensorId);
exports.default = router;
