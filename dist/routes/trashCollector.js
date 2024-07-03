"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trashCollector_1 = require("../controllers/trashCollector");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
router.post('/', authenticate_1.authenticateToken, trashCollector_1.createTrashCollector);
router.post('/assign', authenticate_1.authenticateToken, trashCollector_1.assignTrashbinsToTrashCollector);
exports.default = router;
