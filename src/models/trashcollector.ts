// src/models/trashcollector.ts
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const trashCollectorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    assignedTrashbins: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Trashbin',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const TrashCollector = mongoose.model(
  'TrashCollector',
  trashCollectorSchema
);
