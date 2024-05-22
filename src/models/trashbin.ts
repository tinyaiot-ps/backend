import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const trashbinSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    sensors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Sensor',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Trashbin = mongoose.model('Trashbin', trashbinSchema);
