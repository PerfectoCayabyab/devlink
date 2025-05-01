'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session } = useSession();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      if (!session?.user?.email) return;
      const res = await fetch('/api/me');
      const data = await res.json();
      setUsername(data.username);
    };
    fetchUsername();
  }, [session]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-center">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4">DevLink</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mb-8">
        One simple link to showcase all your developer content: GitHub, portfolio, blogs, and more.
      </p>

      {session ? (
        <>
          <img
            src={session.user?.image ?? '/default-avatar.png'}
            alt="avatar"
            className="w-20 h-20 rounded-full mx-auto border-2 border-blue-500 shadow mb-2"
          />
          <p className="mb-2 text-lg font-medium text-gray-800 dark:text-white">
            Welcome, {session.user?.name}!
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
            {username && (
              <Link
                href={`/${username}`}
                target="_blank"
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                View Public Profile
              </Link>
            )}
          </div>
        </>
      ) : (
        <Link
          href="/api/auth/signin"
          className="px-8 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition text-lg"
        >
          Get Started – Sign in with GitHub
        </Link>
      )}

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-4xl w-full">
        <Feature title="Centralize Your Links" icon="🔗" desc="Combine all your dev content—GitHub, blog, portfolio—into one shareable page." />
        <Feature title="Instant Setup" icon="⚡️" desc="Login with GitHub and start building your profile in seconds." />
        <Feature title="Responsive Design" icon="📱" desc="Your profile looks great on any device with modern, mobile-first styling." />
        <Feature title="Open Source" icon="🛠" desc="Built with Next.js, Tailwind, and MongoDB—fork it and make it yours." />
      </div>
    </main>
  );
}

function Feature({ title, icon, desc }: { title: string; icon: string; desc: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  );
}
