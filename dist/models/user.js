"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    role: {
        type: String,
        enum: ['USER', 'ADMIN', 'SUPERADMIN'],
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    projects: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Project',
        },
    ],
    preferences: {
        language: {
            type: String,
            enum: ['EN', 'DE'],
            required: true,
        },
        themeIsDark: {
            type: Boolean,
            required: true,
        },
    },
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model('User', userSchema);
