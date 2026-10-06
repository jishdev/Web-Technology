// Usage: npm run admin:create -- <username> <password>
// Creates the admin, or resets the password if the username already exists.
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Admin } from '../src/models/index.js';

const [username, password] = process.argv.slice(2);

if (!username || !password || username.length < 3 || password.length < 8) {
  console.error('Usage: npm run admin:create -- <username (min 3)> <password (min 8)>');
  process.exit(1);
}

await connectDB();
await Admin.init();
const passwordHash = await Admin.hashPassword(password);
const existing = await Admin.findOne({ username: username.toLowerCase() });
if (existing) {
  existing.passwordHash = passwordHash;
  await existing.save();
  console.log(`Password reset for "${existing.username}"`);
} else {
  const admin = await Admin.create({ username, passwordHash });
  console.log(`Admin created: "${admin.username}"`);
}
await disconnectDB();
