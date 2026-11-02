// Render entrypoint.
// If MONGODB_URI is set to a real database (e.g. Atlas) it is used as-is.
// Otherwise a temporary in-process MongoDB is started so the API works out of the box
// (data is lost on restart/redeploy; fine for a demo).
import { spawnSync } from 'node:child_process';

const uri = process.env.MONGODB_URI || '';
if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create({ instance: { dbName: 'hash27' } });
  process.env.MONGODB_URI = mongod.getUri('hash27');
  console.log('[render-start] using temporary in-memory MongoDB');
}

const seed = spawnSync(process.execPath, ['scripts/seed.js'], { stdio: 'inherit', env: process.env });
if (seed.status !== 0) console.warn('[render-start] seed exited with', seed.status);

await import('./src/server.js');
