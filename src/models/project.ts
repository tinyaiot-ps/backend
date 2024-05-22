import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      required: true,
      ref: 'City',
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
    initialZoom: {
      type: Number,
      required: true,
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
