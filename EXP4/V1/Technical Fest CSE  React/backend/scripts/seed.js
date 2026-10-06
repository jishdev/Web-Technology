import { env } from '../src/config/env.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Admin, Event, Registration, ContactMessage, TeamMember, Sponsor, GalleryItem, Setting } from '../src/models/index.js';
import * as data from '../src/utils/seedData.js';

const reset = process.argv.includes('--reset');
const yes = process.argv.includes('--yes');

async function insertMissing(Model, docs, keyOf, label) {
  let added = 0;
  for (const doc of docs) {
    if (!(await Model.exists(keyOf(doc)))) {
      await Model.create(doc);
      added += 1;
    }
  }
  console.log(`  ${label}: +${added} new, ${docs.length - added} already present`);
}

async function main() {
  if (reset && env.isProd && !yes) {
    console.error('Refusing to --reset in production without --yes');
    process.exit(1);
  }

  await connectDB();
  await Promise.all([Event, Registration, ContactMessage, TeamMember, Sponsor, GalleryItem, Setting, Admin].map((m) => m.init()));
  console.log(`Seeding ${env.mongoUri.replace(/\/\/[^@]*@/, '//***@')}`);

  if (reset) {
    console.log('  --reset: clearing content collections (admins are kept)');
    await Promise.all([Event, Registration, ContactMessage, TeamMember, Sponsor, GalleryItem, Setting].map((m) => m.deleteMany({})));
  }

  // Site settings: created once, never overwritten.
  if (!(await Setting.exists({ key: 'site' }))) {
    await Setting.create({ key: 'site', ...data.settings });
    console.log('  settings: created');
  } else {
    console.log('  settings: already present');
  }

  await insertMissing(Event, data.events, (d) => ({ slug: d.slug }), 'events');
  await insertMissing(TeamMember, data.team, (d) => ({ name: d.name, section: d.section }), 'team');
  await insertMissing(Sponsor, data.sponsors, (d) => ({ name: d.name }), 'sponsors');
  await insertMissing(GalleryItem, data.gallery, (d) => ({ imageUrl: d.imageUrl }), 'gallery');

  if (!(await Admin.exists({ username: env.adminUsername }))) {
    await Admin.create({ username: env.adminUsername, passwordHash: await Admin.hashPassword(env.adminPassword) });
    console.log(`  admin: created "${env.adminUsername}" (password from ADMIN_PASSWORD)`);
    if (env.isProd && env.adminPassword === 'ChangeMe@2027') {
      console.warn('  !! Default admin password in use. Change it via POST /api/auth/change-password now.');
    }
  } else {
    console.log(`  admin: "${env.adminUsername}" already exists`);
  }

  await disconnectDB();
  console.log('Done.');
}

main().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await disconnectDB().catch(() => {});
  process.exit(1);
});
