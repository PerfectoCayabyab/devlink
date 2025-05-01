import { connectToDatabase } from './mongodb';
import { User } from '@/models/User';

export async function generateUniqueUsername(base: string): Promise<string> {
  await connectToDatabase();

  let username = base.toLowerCase().replace(/[^a-z0-9\-]/g, '');
  if (!username) username = 'user';

  let uniqueUsername = username;
  let counter = 1;

  while (await User.findOne({ username: uniqueUsername })) {
    uniqueUsername = `${username}-${counter}`;
    counter++;
  }

  return uniqueUsername;
}
