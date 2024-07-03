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
exports.generateUniqueTrashbinIdentifier = void 0;
const city_1 = require("../models/city");
const project_1 = require("../models/project");
const trashbin_1 = require("../models/trashbin");
const generateUniqueTrashbinIdentifier = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_1.Project.findById(projectId);
    const city = yield city_1.City.findById(project.city);
    if (!city) {
        throw new Error('City not found');
    }
    const cityName = city.name;
    const formattedCityName = cityName.toLowerCase();
    // Filter by projectId before sorting
    const latestTrashbin = yield trashbin_1.Trashbin.findOne({ project: projectId }).sort({
        createdAt: -1,
    });
    const latestTrashbinCounter = latestTrashbin
        ? parseInt(latestTrashbin.identifier.split('-')[2])
        : 0;
    const counter = (latestTrashbinCounter + 1).toString().padStart(4, '0');
    return `${formattedCityName}-trashbin-${counter}`;
});
exports.generateUniqueTrashbinIdentifier = generateUniqueTrashbinIdentifier;
