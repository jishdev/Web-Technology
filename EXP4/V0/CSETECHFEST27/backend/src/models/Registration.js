import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  event: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  year: { type: String, required: true, trim: true },
  dept: { type: String, required: true, trim: true },
  inst: { type: String, required: true, trim: true },
  team: { type: String, trim: true, default: '' }
}, { timestamps: true });

registrationSchema.index({ email: 1, event: 1 }, { unique: true });
registrationSchema.index({ name: 1, event: 1 });

export default mongoose.model('Registration', registrationSchema);
