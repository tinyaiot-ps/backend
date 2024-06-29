import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const trashbinSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    assignee: { type: mongoose.Types.ObjectId, ref: 'TrashCollector' },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    location: {
      type: String,
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
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Trashbin = mongoose.model('Trashbin', trashbinSchema);
