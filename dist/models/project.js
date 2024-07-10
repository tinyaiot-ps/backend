"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    identifier: {
        type: String,
        required: true,
        unique: true,
    },
    projectType: {
        type: String,
        enum: ['trash', 'noise'],
        required: true,
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: true,
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    centerCoords: {
        type: [Number], // [longitude, latitude]
        required: true,
    },
    startEndCoords: {
        type: [Number], // [longitude, latitude]
        required: true,
    },
    initialZoom: {
        type: Number,
        required: true,
    },
    fillLevelChangeHours: {
        type: Number,
        default: 72,
    },
    activeTimeInterval: {
        type: [Number],
    },
    noiseThreshold: {
        type: Number,
        min: 1,
    },
    confidenceThreshold: {
        type: Number,
        min: 0,
        max: 1,
    },
    preferences: {
        fillThresholds: {
            type: [Number], // [integer, integer]
            required: true,
        },
        batteryThresholds: {
            type: [Number], // [integer, integer]
            required: true,
        },
    },
}, {
    timestamps: true,
});
exports.Project = mongoose_1.default.model('Project', projectSchema);
