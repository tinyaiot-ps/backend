import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
