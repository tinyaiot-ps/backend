import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const sensorSchema = new Schema(
  {
    trashbin: {
      type: Schema.Types.ObjectId,
      ref: 'Trashbin',
      required: true,
    },
    measureType: {
      type: String,
      enum: ['fill_level', 'battery_level'],
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
