import mongoose from 'mongoose';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { Admin } from './models/index.js';
import { createApp } from './app.js';

async function main() {
  await connectDB();
  console.log(`[db] connected: ${mongoose.connection.host}/${mongoose.connection.name}`);

  // Make sure unique indexes exist before accepting traffic.
  await Promise.all(Object.values(mongoose.models).map((m) => m.init()));

  if ((await Admin.estimatedDocumentCount()) === 0) {
    console.warn('[auth] No admin account exists yet. Run: npm run seed');
  }

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`[api] HASH '27 API listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  server.on('error', (err) => {
    console.error(err.code === 'EADDRINUSE' ? `[fatal] port ${env.port} is already in use (set PORT in .env)` : `[fatal] ${err.message}`);
    process.exit(1);
  });

  const shutdown = async (signal) => {
    console.log(`\n[api] ${signal} received, shutting down...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  console.error('[fatal] failed to start:', err.message);
  process.exit(1);
});
