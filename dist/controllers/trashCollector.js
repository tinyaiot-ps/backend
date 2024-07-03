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
exports.createTrashCollector = exports.assignTrashbinsToTrashCollector = void 0;
const trashbin_1 = require("../models/trashbin");
const trashcollector_1 = require("../models/trashcollector");
const assignTrashbinsToTrashCollector = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role;
        if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
            const { assignedTrashbins, trashCollector } = req.body;
            if (!trashCollector) {
                return res.status(400).json({ message: 'Trash collector is required' });
            }
            const existingTrashCollector = yield trashcollector_1.TrashCollector.findOne({
                _id: trashCollector,
            });
            if (!existingTrashCollector) {
                return res
                    .status(400)
                    .json({ message: 'Trash collector does not exist' });
            }
            if (!assignedTrashbins || !Array.isArray(assignedTrashbins)) {
                return res.status(400).json({ message: 'Invalid trashbins data' });
            }
            // Find trashbins that are currently assigned but not in the new list
            const trashbinsToUnassign = existingTrashCollector.assignedTrashbins.filter((id) => !assignedTrashbins.includes(id));
            // Unassign trashbins that are no longer assigned
            yield trashbin_1.Trashbin.updateMany({ _id: { $in: trashbinsToUnassign } }, { $unset: { assignee: '' } });
            // Assign each trashbin to the trash collector
            for (const trashbinId of assignedTrashbins) {
                const trashbin = yield trashbin_1.Trashbin.findById(trashbinId);
                if (!trashbin) {
                    return res
                        .status(400)
                        .json({ message: `Trashbin with ID ${trashbinId} does not exist` });
                }
                trashbin.assignee = existingTrashCollector._id;
                yield trashbin.save();
            }
            // Update the assignedTrashbins array of the trash collector
            existingTrashCollector.assignedTrashbins = assignedTrashbins;
            yield existingTrashCollector.save();
            return res
                .status(200)
                .json({ message: 'Trash bins assigned successfully' });
        }
        else {
            return res.status(403).json({
                message: 'Unauthorized to assign trashbins to trashcollector, should be admin or superadmin',
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.assignTrashbinsToTrashCollector = assignTrashbinsToTrashCollector;
const createTrashCollector = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRole = req.user.role;
        if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
            const { name, assignedTrashbins } = req.body;
            if (!name) {
                return res.status(400).json({ message: 'Name is required' });
            }
            const existingTrashCollector = yield trashcollector_1.TrashCollector.findOne({ name });
            if (existingTrashCollector) {
                return res.status(400).json({
                    message: 'A trash collector with the same name already exists',
                });
            }
            if (!assignedTrashbins) {
                req.body.assignedTrashbins = []; // Set assignedTrashbins to an empty array if not provided
            }
            else if (!Array.isArray(assignedTrashbins)) {
                return res
                    .status(400)
                    .json({ message: 'Assigned trashbins must be an array' });
            }
            // Check if all assigned trashbins exist in the database
            const allTrashbinsExist = (assignedTrashbins === null || assignedTrashbins === void 0 ? void 0 : assignedTrashbins.length) > 0 &&
                assignedTrashbins.every((trashbinId) => __awaiter(void 0, void 0, void 0, function* () {
                    const trashbin = yield trashbin_1.Trashbin.findById(trashbinId);
                    return trashbin !== null;
                }));
            console.log('All Trashbins exists =>', allTrashbinsExist);
            if ((assignedTrashbins === null || assignedTrashbins === void 0 ? void 0 : assignedTrashbins.length) > 0 && !allTrashbinsExist) {
                return res
                    .status(400)
                    .json({ message: 'One or more assigned trashbins do not exist' });
            }
            const newTrashCollector = new trashcollector_1.TrashCollector({
                name,
                assignedTrashbins,
            });
            yield newTrashCollector.save();
            yield trashbin_1.Trashbin.updateMany({ _id: { $in: assignedTrashbins } }, { assignee: newTrashCollector._id });
            return res
                .status(201)
                .json({ message: 'Trash collector created successfully' });
        }
        else {
            return res.status(403).json({
                message: 'Unauthorized to create trashcollector',
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createTrashCollector = createTrashCollector;
