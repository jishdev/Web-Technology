import mongoose from 'mongoose';
import { jsonTransform } from './_transform.js';

// Single-document site configuration (key: "site").
const daySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, min: 1, max: 10 },
    weekday: { type: String, trim: true, maxlength: 20 },
    dateLabel: { type: String, required: true, trim: true, maxlength: 40 },
  },
  { _id: false }
);

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true, immutable: true },
    eventName: { type: String, default: "HASH '27", trim: true, maxlength: 80 },
    registrationOpen: { type: Boolean, default: true },
    // null = no deadline
    registrationClosesAt: { type: Date, default: null },
    days: { type: [daySchema], default: [] },
  },
  { timestamps: true, toJSON: jsonTransform, toObject: jsonTransform }
);

settingSchema.statics.getSite = async function getSite() {
  let doc = await this.findOne({ key: 'site' });
  if (!doc) {
    try {
      doc = await this.create({ key: 'site' });
    } catch (err) {
      if (err?.code === 11000) doc = await this.findOne({ key: 'site' });
      else throw err;
    }
  }
  return doc;
};

settingSchema.methods.isRegistrationOpen = function isRegistrationOpen(now = new Date()) {
  if (!this.registrationOpen) return false;
  return !this.registrationClosesAt || now <= this.registrationClosesAt;
};

export const Setting = mongoose.model('Setting', settingSchema);
