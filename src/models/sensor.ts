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
  },
  {
    timestamps: true,
  }
);

export const Sensor = mongoose.model('Sensor', sensorSchema);
