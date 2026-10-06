import { Router } from 'express';
import Registration from '../models/Registration.js';
import { requireAdmin } from '../middleware/auth.js';
import { validateRegistration } from '../validation.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const errors = validateRegistration(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Please correct the highlighted fields.', errors });
    const existing = await Registration.findOne({ email: req.body.email.trim().toLowerCase(), event: req.body.event.trim() });
    if (existing) return res.status(409).json({ message: 'This email is already registered for this event.' });
    const registration = await Registration.create({
      event: req.body.event.trim(), name: req.body.name.trim(), email: req.body.email.trim(),
      phone: req.body.phone.trim(), year: req.body.year.trim(), dept: req.body.dept.trim(),
      inst: req.body.inst.trim(), team: String(req.body.team || '').trim()
    });
    res.status(201).json(registration);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'This email is already registered for this event.' });
    next(error);
  }
});

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const q = String(req.query.search || '').trim();
    const filter = q ? { $or: [
      { name: { $regex: q, $options: 'i' } }, { event: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ] } : {};
    const registrations = await Registration.find(filter).sort({ createdAt: -1 }).lean();
    res.json(registrations);
  } catch (error) { next(error); }
});

router.get('/export', requireAdmin, async (req, res, next) => {
  try {
    const rows = await Registration.find({}).sort({ createdAt: -1 }).lean();
    const cell = value => {
      let x = String(value ?? '').replace(/"/g, '""');
      if (/^[=+\-@]/.test(x)) x = `'${x}`;
      return /[",\n]/.test(x) ? `"${x}"` : x;
    };
    const header = ['Name','Event','Email','Phone','Year','Department','Institution','Team','Registered At'];
    const csv = [header.join(','), ...rows.map(p => [
      p.name,p.event,p.email,p.phone,p.year,p.dept,p.inst,p.team,p.createdAt?.toISOString()
    ].map(cell).join(','))].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="hash27-participants.csv"');
    res.send(csv);
  } catch (error) { next(error); }
});

router.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const allowed = ['event','name','email','phone','year','dept','inst','team'];
    const update = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => allowed.includes(key)));
    const registration = await Registration.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!registration) return res.status(404).json({ message: 'Registration not found.' });
    res.json(registration);
  } catch (error) { next(error); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const result = await Registration.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Registration not found.' });
    res.json({ message: 'Registration deleted.' });
  } catch (error) { next(error); }
});

router.delete('/', requireAdmin, async (req, res, next) => {
  try {
    const result = await Registration.deleteMany({});
    res.json({ message: 'Registrations cleared.', deletedCount: result.deletedCount });
  } catch (error) { next(error); }
});

export default router;
