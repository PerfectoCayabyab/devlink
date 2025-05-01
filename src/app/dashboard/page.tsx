'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import LinkEditor from '@/components/LinkEditor';
import SortableItem from '@/components/SortableItem';
import Shell from '@/components/Shell';
import { nanoid } from 'nanoid';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

type Link = {
  id: string;
  title: string;
  url: string;
  icon: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/me');
      const data = await res.json();
      setBio(data.bio || '');
      setUsername(data.username || '');
      const linksWithIds = (data.links || []).map((link: any) => ({
        id: link.id ?? nanoid(),
        title: link.title,
        url: link.url,
        icon: link.icon ?? 'default',
      }));
      setLinks(linksWithIds);
      setLoading(false);
    };

    if (session) fetchData();
  }, [session]);

  const updateLink = (index: number, field: keyof Link, value: string) => {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  };

  const addLink = () => {
    setLinks([...links, { id: nanoid(), title: '', url: '', icon: 'default' }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    setLinks(arrayMove(links, oldIndex, newIndex));
  };

  const saveProfile = async () => {
    const usernameRegex = /^[a-z0-9\-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      alert('Username must be 3–20 characters, lowercase, no spaces.');
      return;
    }

    const check = await fetch(`/api/username-check?username=${username}`);
    const exists = await check.json();
    if (exists.taken) {
      alert('Username is already taken.');
      return;
    }

    const res1 = await fetch('/api/me', {
      method: 'POST',
      body: JSON.stringify({ bio, username }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res2 = await fetch('/api/me', {
      method: 'PUT',
      body: JSON.stringify({ links }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res1.ok && res2.ok) alert('Profile updated!');
    else alert('Error saving profile.');
  };

  if (status === 'loading' || loading) return <p className="text-center">Loading...</p>;
  if (!session) return <p className="text-center text-red-500">Please sign in to view your dashboard.</p>;

  return (
    <Shell>
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <img
          src={session.user?.image ?? '/default-avatar.png'}
          alt="avatar"
          className="w-20 h-20 rounded-full mx-auto border shadow"
        />
        <h1 className="text-2xl font-bold mt-4">{session.user?.name}</h1>
        <p className="text-sm text-gray-500">Manage your profile links below</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Links</h2>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map((link) => link.id)} strategy={verticalListSortingStrategy}>
            {links.map((link, index) => (
              <SortableItem key={link.id} id={link.id}>
                <LinkEditor link={link} index={index} onChange={updateLink} onRemove={removeLink} />
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>

        <button
          onClick={addLink}
          className="mt-3 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        >
          + Add Link
        </button>
      </div>

      <button
        onClick={saveProfile}
        className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-lg"
      >
        Save Profile
      </button>
    </main>
    </Shell>
  );
}
