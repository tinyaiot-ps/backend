import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const citySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const City = mongoose.model('City', citySchema);
