"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sensor = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const sensorSchema = new Schema({
    applianceType: {
        type: String,
        enum: ['trashbin', 'noise-detector'],
        required: true,
    },
    trashbin: {
        type: Schema.Types.ObjectId,
        ref: 'Trashbin',
        required: false,
    },
    measureType: {
        type: String,
        enum: ['fill_level', 'battery_level', 'noise_level'],
        required: true,
    },
    unit: {
        type: String,
        enum: ['percentage', 'decibel'],
        default: 'percentage',
    },
    noiseProject: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    history: [
        {
            type: Schema.Types.ObjectId,
            ref: 'History',
            default: '',
        },
    ],
}, {
    timestamps: true,
});
exports.Sensor = mongoose_1.default.model('Sensor', sensorSchema);
