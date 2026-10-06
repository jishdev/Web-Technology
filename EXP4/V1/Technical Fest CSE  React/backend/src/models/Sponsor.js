import mongoose from 'mongoose';
import { jsonTransform } from './_transform.js';

export const SPONSOR_TIERS = [
  { key: 'title', title: 'Title Sponsor' },
  { key: 'platinum', title: 'Platinum Sponsors' },
  { key: 'gold', title: 'Gold Sponsors' },
  { key: 'silver', title: 'Silver Sponsors' },
  { key: 'community', title: 'Community Partners' },
];
export const SPONSOR_TIER_KEYS = SPONSOR_TIERS.map((t) => t.key);

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    tagline: { type: String, trim: true, maxlength: 160 },
    tier: { type: String, required: true, enum: SPONSOR_TIER_KEYS },
    logoUrl: { type: String, trim: true, maxlength: 300 },
    websiteUrl: { type: String, trim: true, maxlength: 300 },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: jsonTransform, toObject: jsonTransform }
);

sponsorSchema.index({ tier: 1, order: 1 });

export const Sponsor = mongoose.model('Sponsor', sponsorSchema);
