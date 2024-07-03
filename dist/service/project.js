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
exports.generateUniqueProjectIdentifier = void 0;
const project_1 = require("../models/project");
const city_1 = require("../models/city");
const generateUniqueProjectIdentifier = (cityId) => __awaiter(void 0, void 0, void 0, function* () {
    const city = yield city_1.City.findById(cityId);
    if (!city) {
        return null;
    }
    const latestProject = yield project_1.Project.findOne().sort({
        createdAt: -1,
    });
    let latestProjectCounter = 0;
    if (latestProject && latestProject.identifier) {
        const parts = latestProject.identifier.split('-');
        if (parts.length === 3 && !isNaN(parseInt(parts[2]))) {
            latestProjectCounter = parseInt(parts[2]);
        }
    }
    const counter = (latestProjectCounter + 1).toString().padStart(4, '0');
    return `${city.name.toLowerCase()}-project-${counter}`;
});
exports.generateUniqueProjectIdentifier = generateUniqueProjectIdentifier;
