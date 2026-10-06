import mongoose from 'mongoose';
import { jsonTransform } from './_transform.js';

// key -> display title + whether the section renders as a "patron" card
export const TEAM_SECTIONS = [
  { key: 'faculty-coordinator', title: 'Faculty Coordinator', patron: true },
  { key: 'student-coordinator', title: 'Student Coordinator', patron: true },
  { key: 'technical', title: 'Technical Team', patron: false },
  { key: 'event-management', title: 'Event Management', patron: false },
  { key: 'creative-design', title: 'Creative & Design', patron: false },
  { key: 'outreach-pr', title: 'Outreach & Public Relations', patron: false },
  { key: 'operations-support', title: 'Operations & Support', patron: false },
];
export const TEAM_SECTION_KEYS = TEAM_SECTIONS.map((s) => s.key);

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    role: { type: String, required: true, trim: true, maxlength: 80 },
    department: { type: String, trim: true, maxlength: 80 },
    section: { type: String, required: true, enum: TEAM_SECTION_KEYS },
    order: { type: Number, default: 0 },
    photoUrl: { type: String, trim: true, maxlength: 300 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: jsonTransform, toObject: jsonTransform }
);

teamMemberSchema.index({ section: 1, order: 1 });

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
