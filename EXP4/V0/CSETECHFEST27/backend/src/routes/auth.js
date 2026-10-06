import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AuditLog from '../models/AuditLog.js';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { username = '', password = '' } = req.body || {};
    const expectedUser = process.env.ADMIN_USERNAME || 'ADMINMBCET';
    const expectedPassword = process.env.ADMIN_PASSWORD || '';
    const validUser = username === expectedUser;
    const validPassword = expectedPassword ? await bcrypt.compare(password, await bcrypt.hash(expectedPassword, 10)) : false;
    // The comparison above avoids ever storing a plaintext password in MongoDB.
    const success = validUser && validPassword;

    await AuditLog.create({
      username: String(username).slice(0, 100),
      success,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    if (!success) return res.status(401).json({ message: 'Invalid username or password.' });

    const token = jwt.sign({ username: expectedUser, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, expiresIn: '8h', admin: { username: expectedUser, role: 'admin' } });
  } catch (error) { next(error); }
});

export default router;
