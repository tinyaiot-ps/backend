"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trashbin_1 = require("../controllers/trashbin");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// Get a trash item by ID
router.get('/:id', authenticate_1.authenticateToken, trashbin_1.getTrashItemById);
// Get all trash items
router.get('/', authenticate_1.authenticateToken, trashbin_1.getAllTrashItems);
// Create a new trash item
router.post('/', authenticate_1.authenticateToken, trashbin_1.createTrashItem);
router.patch('/:id', authenticate_1.authenticateToken, trashbin_1.updateTrashItem);
router.post('/script', authenticate_1.authenticateToken, trashbin_1.addMultipleTrashItems);
exports.default = router;
