import { Router } from 'express';
import mongoose from 'mongoose';
import { validate } from '../middleware/validate.js';
import { requireAdmin, optionalAdmin, requireUser, optionalUser } from '../middleware/auth.js';
import { loginLimiter, registerLimiter, contactLimiter, signupLimiter } from '../middleware/rateLimiters.js';
import * as S from '../validators/schemas.js';
import * as auth from '../controllers/auth.controller.js';
import * as users from '../controllers/users.controller.js';
import * as settings from '../controllers/settings.controller.js';
import * as events from '../controllers/events.controller.js';
import * as registrations from '../controllers/registrations.controller.js';
import * as contact from '../controllers/contact.controller.js';
import * as team from '../controllers/team.controller.js';
import * as sponsors from '../controllers/sponsors.controller.js';
import * as gallery from '../controllers/gallery.controller.js';
import * as uploads from '../controllers/upload.controller.js';
import { stats } from '../controllers/stats.controller.js';

const router = Router();
const DB_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

router.get('/health', (_req, res) => {
  const db = DB_STATES[mongoose.connection.readyState] ?? 'unknown';
  res.status(db === 'connected' ? 200 : 503).json({
    success: db === 'connected',
    data: { status: db === 'connected' ? 'ok' : 'degraded', db, uptimeSeconds: Math.round(process.uptime()), time: new Date().toISOString() },
  });
});

/* ---- user accounts (public signup/login) ---- */
router.post('/users/signup', signupLimiter, validate({ body: S.signupBody }), users.signup);
router.post('/users/login', loginLimiter, validate({ body: S.userLoginBody }), users.login);
router.get('/users/me', requireUser, users.me);
router.put('/users/me', requireUser, validate({ body: S.updateMeBody }), users.updateMe);
router.post('/users/change-password', requireUser, validate({ body: S.userChangePasswordBody }), users.changePassword);
router.get('/users/me/registrations', requireUser, users.myRegistrations);

/* ---- admin auth ---- */
router.post('/auth/login', loginLimiter, validate({ body: S.loginBody }), auth.login);
router.get('/auth/me', requireAdmin, auth.me);
router.post('/auth/change-password', requireAdmin, validate({ body: S.changePasswordBody }), auth.changePassword);

/* ---- settings ---- */
router.get('/settings', settings.getSettings);
router.route('/settings').put(requireAdmin, validate({ body: S.settingsBody }), settings.updateSettings).patch(requireAdmin, validate({ body: S.settingsBody }), settings.updateSettings);

/* ---- events ---- */
router.get('/events', validate({ query: S.eventListQuery }), events.list);
router.get('/events/schedule', events.schedule);
router.post('/events', requireAdmin, validate({ body: S.eventCreateBody }), events.create);
router.get('/events/:id', validate({ params: S.idOrSlugParams }), events.getOne);
router
  .route('/events/:id')
  .put(requireAdmin, validate({ params: S.idParams, body: S.eventUpdateBody }), events.update)
  .patch(requireAdmin, validate({ params: S.idParams, body: S.eventUpdateBody }), events.update)
  .delete(requireAdmin, validate({ params: S.idParams, query: S.eventDeleteQuery }), events.remove);

/* ---- registrations ---- */
router.post('/registrations', registerLimiter, optionalUser, validate({ body: S.registrationCreateBody }), registrations.create);
router.get('/registrations', requireAdmin, validate({ query: S.registrationListQuery }), registrations.list);
router.get('/registrations/export', requireAdmin, validate({ query: S.registrationExportQuery }), registrations.exportCsv);
router
  .route('/registrations/:id')
  .get(requireAdmin, validate({ params: S.idParams }), registrations.getOne)
  .put(requireAdmin, validate({ params: S.idParams, body: S.registrationUpdateBody }), registrations.update)
  .patch(requireAdmin, validate({ params: S.idParams, body: S.registrationUpdateBody }), registrations.update)
  .delete(requireAdmin, validate({ params: S.idParams }), registrations.remove);

/* ---- contact messages ---- */
router.post('/contact', contactLimiter, validate({ body: S.contactCreateBody }), contact.create);
router.get('/contact', requireAdmin, validate({ query: S.contactListQuery }), contact.list);
router
  .route('/contact/:id')
  .get(requireAdmin, validate({ params: S.idParams }), contact.getOne)
  .put(requireAdmin, validate({ params: S.idParams, body: S.contactUpdateBody }), contact.update)
  .patch(requireAdmin, validate({ params: S.idParams, body: S.contactUpdateBody }), contact.update)
  .delete(requireAdmin, validate({ params: S.idParams }), contact.remove);

/* ---- team / sponsors / gallery (public reads, admin writes) ---- */
function mountContent(base, ctrl, schemas, listQuery) {
  router.get(`/${base}`, optionalAdmin, validate({ query: listQuery }), ctrl.list);
  if (ctrl.grouped) router.get(`/${base}/grouped`, optionalAdmin, validate({ query: listQuery }), ctrl.grouped);
  router.post(`/${base}`, requireAdmin, validate({ body: schemas.create }), ctrl.create);
  router.get(`/${base}/:id`, optionalAdmin, validate({ params: S.idParams }), ctrl.getOne);
  router
    .route(`/${base}/:id`)
    .put(requireAdmin, validate({ params: S.idParams, body: schemas.update }), ctrl.update)
    .patch(requireAdmin, validate({ params: S.idParams, body: schemas.update }), ctrl.update)
    .delete(requireAdmin, validate({ params: S.idParams }), ctrl.remove);
}
mountContent('team', team, { create: S.teamCreateBody, update: S.teamUpdateBody }, S.teamListQuery);
mountContent('sponsors', sponsors, { create: S.sponsorCreateBody, update: S.sponsorUpdateBody }, S.sponsorListQuery);
mountContent('gallery', gallery, { create: S.galleryCreateBody, update: S.galleryUpdateBody }, S.galleryListQuery);

/* ---- uploads + admin ---- */
router.post('/uploads', requireAdmin, uploads.uploadImage, uploads.handleUpload);
router.delete('/uploads/:filename', requireAdmin, validate({ params: S.uploadFileParams }), uploads.removeUpload);
router.get('/admin/stats', requireAdmin, stats);

export default router;
