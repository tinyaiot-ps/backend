"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrashCollector = void 0;
// src/models/trashcollector.ts
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const trashCollectorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    assignedTrashbins: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Trashbin',
            required: true,
        },
    ],
}, {
    timestamps: true,
});
exports.TrashCollector = mongoose_1.default.model('TrashCollector', trashCollectorSchema);
