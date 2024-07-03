"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const city_1 = require("../controllers/city");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// Get a city by ID
router.get('/:id', authenticate_1.authenticateToken, city_1.getCityById);
// Get all cities, with optional filters
router.get('/', authenticate_1.authenticateToken, city_1.getAllCities);
// Create a new city
router.post('/', authenticate_1.authenticateToken, city_1.createCity);
exports.default = router;
