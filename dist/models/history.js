"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const historySchema = new Schema({
    sensor: {
        type: Schema.Types.ObjectId,
        ref: 'Sensor',
        required: true,
    },
    measureType: {
        type: String,
        enum: ['fill_level', 'battery_level', 'sound_level'],
        required: true,
    },
    measurement: {
        type: Number,
        required: true,
    },
    error: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.History = mongoose_1.default.model('History', historySchema);
