import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  username: { type: String, trim: true, maxlength: 100 },
  success: { type: Boolean, required: true },
  ip: { type: String, trim: true },
  userAgent: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('AuditLog', auditSchema);
