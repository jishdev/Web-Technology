import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { jsonTransform } from './_transform.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 120 },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, trim: true, match: /^[6-9]\d{9}$/ },
    institution: { type: String, trim: true, maxlength: 120 },
    // Denormalised for the "My registrations" view; kept in sync by the registrations controller.
    lastLoginAt: { type: Date },
  },
  { timestamps: true, toJSON: jsonTransform, toObject: jsonTransform }
);

userSchema.statics.hashPassword = (plain) => bcrypt.hash(plain, 12);
userSchema.methods.verifyPassword = function verifyPassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
