import { db } from '../db';
import { users, profiles, links, wishes } from './schema';

async function resetDatabase() {
  console.log('Starting Database Clean-up...');
  try {
    // Drop all records in correct order to prevent foreign key issues
    await db.delete(wishes);
    await db.delete(links);
    await db.delete(profiles);
    await db.delete(users);
    console.log('Database successfully cleared! All old accounts deleted.');
  } catch (error) {
    console.error('Error during database reset:', error);
  }
}

resetDatabase().then(() => process.exit(0));
