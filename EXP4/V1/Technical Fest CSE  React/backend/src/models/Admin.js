import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { jsonTransform } from './_transform.js';

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
    },
    passwordHash: { type: String, required: true, select: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true, toJSON: jsonTransform, toObject: jsonTransform }
);

adminSchema.statics.hashPassword = (plain) => bcrypt.hash(plain, 12);

adminSchema.methods.verifyPassword = function verifyPassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export const Admin = mongoose.model('Admin', adminSchema);
