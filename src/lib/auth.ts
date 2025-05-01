// File: src/lib/auth.ts
import GitHubProvider from 'next-auth/providers/github';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongodb-client';
import { connectToDatabase } from './mongodb';
import { User } from '@/models/User';

function sanitizeUsername(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\-]/g, '');
}

async function generateUniqueUsername(base: string): Promise<string> {
  await connectToDatabase();

  let username = sanitizeUsername(base);
  if (!username) username = 'user';

  let uniqueUsername = username;
  let counter = 1;

  while (await User.findOne({ username: uniqueUsername })) {
    uniqueUsername = `${username}-${counter}`;
    counter++;
  }

  return uniqueUsername;
}

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: { user: any }) {
      await connectToDatabase();

      const existing = await User.findOne({ email: user.email });
      if (existing && existing.username) return true;

      const base = user.name || user.email?.split('@')[0] || 'user';
      const username = await generateUniqueUsername(base);

      await User.updateOne(
        { email: user.email },
        { $set: { username } }
      );

      return true;
    },
  },
};
