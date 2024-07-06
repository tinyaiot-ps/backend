import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
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
      type: Number,
      min: 0,
      max: 24,
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
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model('Project', projectSchema);
