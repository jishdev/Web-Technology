import { Router } from 'express';
import Contact from '../models/Contact.js';
import { requireAdmin } from '../middleware/auth.js';
import { isEmail } from '../validation.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { name='', email='', subject='', message='' } = req.body || {};
    if (!String(name).trim() || !isEmail(email) || !String(subject).trim() || !String(message).trim()) {
      return res.status(400).json({ message: 'Name, valid email, subject and message are required.' });
    }
    const contact = await Contact.create({ name: String(name).trim(), email: String(email).trim(), subject: String(subject).trim(), message: String(message).trim() });
    res.status(201).json({ message: 'Message received.', id: contact._id });
  } catch (error) { next(error); }
});

router.get('/', requireAdmin, async (req, res, next) => {
  try { res.json(await Contact.find({}).sort({ createdAt: -1 }).lean()); }
  catch (error) { next(error); }
});

router.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!contact) return res.status(404).json({ message: 'Contact message not found.' });
    res.json(contact);
  } catch (error) { next(error); }
});

export default router;
