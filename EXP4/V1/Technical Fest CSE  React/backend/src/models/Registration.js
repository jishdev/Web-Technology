import mongoose from 'mongoose';
import { jsonTransform } from './_transform.js';

export const YEARS = ['S1', 'S3', 'S5', 'S7', 'PG'];
export const REGISTRATION_STATUSES = ['confirmed', 'attended', 'cancelled'];

const registrationSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, match: /^[6-9]\d{9}$/ },
    year: { type: String, required: true, enum: YEARS },
    department: { type: String, required: true, trim: true, maxlength: 60 },
    institution: { type: String, required: true, trim: true, maxlength: 120 },
    teamName: { type: String, trim: true, maxlength: 60 },
    status: { type: String, enum: REGISTRATION_STATUSES, default: 'confirmed' },
  },
  { timestamps: true, toJSON: jsonTransform, toObject: jsonTransform }
);

// One registration per person per event.
registrationSchema.index({ event: 1, email: 1 }, { unique: true });
registrationSchema.index({ createdAt: -1 });
registrationSchema.index({ user: 1, createdAt: -1 });

export const Registration = mongoose.model('Registration', registrationSchema);
