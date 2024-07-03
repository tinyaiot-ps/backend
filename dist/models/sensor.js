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
    noiseDetector: {
        type: Schema.Types.ObjectId,
        ref: 'NoiseDetector',
        required: false,
    },
    measureType: {
        type: String,
        enum: ['fill_level', 'battery_level', 'sound_level'],
        required: true,
    },
    unit: {
        type: String,
        enum: ['percentage'],
        default: 'percentage',
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
