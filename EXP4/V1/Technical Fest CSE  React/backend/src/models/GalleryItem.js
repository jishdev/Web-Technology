import mongoose from 'mongoose';
import { jsonTransform } from './_transform.js';

const galleryItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 80 },
    alt: { type: String, trim: true, maxlength: 160 },
    imageUrl: { type: String, required: true, trim: true, maxlength: 300 },
    // Which edition the photo belongs to, e.g. "2025"
    edition: { type: String, required: true, trim: true, maxlength: 10, default: '2025' },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: jsonTransform, toObject: jsonTransform }
);

galleryItemSchema.index({ edition: 1, order: 1 });

export const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
