// Render entrypoint.
// If MONGODB_URI is set to a real database (e.g. Atlas) it is used as-is.
// Otherwise a temporary in-process MongoDB is started so the API works out of the box
// (data is lost on restart/redeploy; fine for a demo).
import { spawn } from 'node:child_process';

const uri = process.env.MONGODB_URI || '';
if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create({ instance: { dbName: 'hash27' } });
  process.env.MONGODB_URI = mongod.getUri('hash27');
  console.log('[render-start] using temporary in-memory MongoDB');
}

// Async spawn: keeps this event loop free to drain the in-memory mongod's output pipes.
const code = await new Promise((resolve) => {
  const child = spawn(process.execPath, ['scripts/seed.js'], { stdio: 'inherit', env: process.env });
  child.on('exit', resolve);
  child.on('error', () => resolve(1));
});
if (code !== 0) console.warn('[render-start] seed exited with', code);

await import('./src/server.js');
