import { Router } from 'express';
import Registration from '../models/Registration.js';
import Task from '../models/Task.js';
import AuditLog from '../models/AuditLog.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

router.get('/dashboard', async (req,res,next)=>{
  try {
    const q=String(req.query.search||'').trim();
    const filter=q?{$or:[{name:{$regex:q,$options:'i'}},{event:{$regex:q,$options:'i'}},{email:{$regex:q,$options:'i'}}]}:{};
    const [participants,tasks,logs,total,eventAgg,latest]=await Promise.all([
      Registration.find(filter).sort({createdAt:-1}).lean(),
      Task.find({}).sort({createdAt:1}).lean(),
      AuditLog.find({}).sort({createdAt:-1}).limit(50).lean(),
      Registration.countDocuments({}),
      Registration.distinct('event'),
      Registration.findOne({}).sort({createdAt:-1}).select('event').lean()
    ]);
    res.json({participants,tasks,logs,stats:{total,events:eventAgg.length,latest:latest?.event||'—'}});
  } catch(e){next(e)}
});

router.delete('/audit', async (req,res,next)=>{try{const r=await AuditLog.deleteMany({});res.json({deletedCount:r.deletedCount})}catch(e){next(e)}});
router.get('/contacts', async (req,res,next)=>{try{res.json([])}catch(e){next(e)}});

export default router;
