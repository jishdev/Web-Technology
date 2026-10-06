import mongoose from 'mongoose';
import { jsonTransform } from './_transform.js';

const eventSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      maxlength: 60,
    },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    day: { type: Number, required: true, min: 1, max: 10 },
    // Display label, e.g. "09:00 AM". Ordering uses sortOrder.
    time: { type: String, required: true, trim: true, maxlength: 20 },
    sortOrder: { type: Number, default: 0 },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    venue: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 1000 },
    badgeText: { type: String, trim: true, maxlength: 20 },
    badgeStyle: { type: String, enum: ['live', 'closing', null], default: null },
    isTeamEvent: { type: Boolean, default: false },
    // 0 = unlimited seats
    capacity: { type: Number, default: 0, min: 0 },
    registeredCount: { type: Number, default: 0, min: 0 },
    // false = registrations closed for this event only
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: jsonTransform, toObject: jsonTransform }
);

eventSchema.index({ day: 1, sortOrder: 1 });

eventSchema.virtual('seatsLeft').get(function seatsLeft() {
  return this.capacity > 0 ? Math.max(0, this.capacity - this.registeredCount) : null;
});
eventSchema.virtual('isFull').get(function isFull() {
  return this.capacity > 0 && this.registeredCount >= this.capacity;
});

export const Event = mongoose.model('Event', eventSchema);
