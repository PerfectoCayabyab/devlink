import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
  
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  
    // ✅ Include username in the response
    return NextResponse.json({
      bio: user.bio,
      links: user.links,
      username: user.username,
    });
  }
  

  export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
    const { bio, username } = await req.json();
    await connectToDatabase();
  
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { bio, username } },
      { new: true }
    );
  
    return NextResponse.json(updatedUser);
  }
  

  export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
    const { links } = await req.json();
    await connectToDatabase();
  
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { links } },
      { new: true }
    );
  
    return NextResponse.json(updatedUser);
  }
  
  