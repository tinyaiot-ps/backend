"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trashbin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const trashbinSchema = new Schema({
    identifier: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    assignee: { type: mongoose_1.default.Types.ObjectId, ref: 'TrashCollector' },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
    },
    location: {
        type: String,
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    signalStrength: {
        type: Number,
        max: 100,
        default: 0,
    },
    image: {
        type: String,
    },
    batteryLevel: {
        type: Number,
        min: 0,
        max: 100,
        default: 100,
    },
    lastEmptied: {
        type: Date,
    },
    fillLevel: {
        type: Number,
    },
    fillLevelChange: {
        type: Number,
        default: 0,
    },
    sensors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Sensor',
            default: [],
        },
    ],
}, {
    timestamps: true,
});
exports.Trashbin = mongoose_1.default.model('Trashbin', trashbinSchema);
