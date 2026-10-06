import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import registrationRoutes from './routes/registrations.js';
import contactRoutes from './routes/contacts.js';
import taskRoutes from './routes/tasks.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.set('trust proxy', 1);
app.use(helmet());
const allowedOrigins = CLIENT_ORIGIN.split(',').map(x => x.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS origin not allowed'));
  },
  credentials: false
}));
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Too many authentication attempts. Try again later.' } });
app.use('/api/auth', authLimiter);

app.get('/api/health', (req,res)=>res.json({ status:'ok', service:'HASH TechFest 2027 API', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', timestamp:new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

app.use((req,res)=>res.status(404).json({message:'API route not found.'}));
app.use((err,req,res,next)=>{
  console.error(err);
  if (err.name === 'ValidationError') return res.status(400).json({message:'Validation failed.', errors:Object.fromEntries(Object.entries(err.errors).map(([k,v])=>[k,v.message]))});
  res.status(err.status || 500).json({message:err.message || 'Internal server error.'});
});

async function start() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required in .env');
  if (!process.env.ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD is required in .env');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hash_techfest_2027');
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
  app.listen(PORT, ()=>console.log(`HASH API running at http://localhost:${PORT}`));
}
start().catch(err=>{console.error('Startup failed:',err.message);process.exit(1)});
