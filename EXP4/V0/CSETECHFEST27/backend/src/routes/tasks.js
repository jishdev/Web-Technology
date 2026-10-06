import { Router } from 'express';
import Task from '../models/Task.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (req,res,next)=>{ try { res.json(await Task.find({}).sort({createdAt:1}).lean()); } catch(e){next(e)} });
router.post('/', async (req,res,next)=>{
  try { const text=String(req.body?.text||'').trim(); if(!text) return res.status(400).json({message:'Task text is required.'}); res.status(201).json(await Task.create({text})); } catch(e){next(e)}
});
router.patch('/:id', async (req,res,next)=>{
  try { const task=await Task.findByIdAndUpdate(req.params.id,{completed:!!req.body.completed,text:req.body.text},{new:true,runValidators:true}); if(!task)return res.status(404).json({message:'Task not found.'}); res.json(task); } catch(e){next(e)}
});
router.delete('/:id', async (req,res,next)=>{try{const t=await Task.findByIdAndDelete(req.params.id);if(!t)return res.status(404).json({message:'Task not found.'});res.json({message:'Task deleted.'})}catch(e){next(e)}});
export default router;
