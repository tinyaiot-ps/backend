import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const sensorSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

export const Sensor = mongoose.model('Sensor', sensorSchema);
