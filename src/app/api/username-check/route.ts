import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) return NextResponse.json({ error: 'No username provided' }, { status: 400 });

  await connectToDatabase();

  const user = await User.findOne({ username });

  return NextResponse.json({ taken: !!user });
}
