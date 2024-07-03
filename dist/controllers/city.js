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
exports.createCity = exports.getAllCities = exports.getCityById = void 0;
const city_1 = require("../models/city");
const getCityById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const city = yield city_1.City.findById(req.params.id);
        if (!city) {
            return res.status(404).send('City not found');
        }
        res.json({
            message: 'City found',
            city,
        });
    }
    catch (error) {
        res.status(500).send('Server error');
    }
});
exports.getCityById = getCityById;
const getAllCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cities = yield city_1.City.find({});
        res.json({
            message: 'Cities found',
            cities,
        });
    }
    catch (error) {
        res.status(500).send('Server error');
    }
});
exports.getAllCities = getAllCities;
const createCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role !== 'SUPERADMIN') {
        return res.status(403).send('Only superadmin can create new cities');
    }
    try {
        const { name } = req.body;
        const existingCity = yield city_1.City.findOne({ name });
        if (existingCity) {
            return res.status(409).send('City already exists');
        }
        const newCity = new city_1.City({ name });
        yield newCity.save();
        res.status(201).json(newCity);
    }
    catch (error) {
        res.status(500).send('Server error');
    }
});
exports.createCity = createCity;
