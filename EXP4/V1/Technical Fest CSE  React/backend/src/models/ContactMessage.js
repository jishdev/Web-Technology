import mongoose from 'mongoose';
import { jsonTransform } from './_transform.js';

export const MESSAGE_STATUSES = ['new', 'read', 'resolved'];

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 120 },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: MESSAGE_STATUSES, default: 'new' },
  },
  { timestamps: true, toJSON: jsonTransform, toObject: jsonTransform }
);

contactMessageSchema.index({ createdAt: -1 });

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
