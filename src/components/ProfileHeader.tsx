'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function ProfileHeader() {
  const { data: session } = useSession();

  return (
    <header className="w-full px-6 py-4 border-b bg-white dark:bg-black flex items-center justify-between max-w-5xl mx-auto">
      <Link href="/" className="text-xl font-bold text-blue-600">DevLink</Link>
      <div className="flex gap-4 items-center text-sm">
        {session && (
          <>
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="text-red-500 hover:underline"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
