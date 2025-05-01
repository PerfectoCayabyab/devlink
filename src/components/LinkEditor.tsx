'use client';

import React from 'react';
import { Github, Linkedin, Globe, Twitter, Link as DefaultLink } from 'lucide-react';

type Link = {
  title: string;
  url: string;
  icon: string;
};

type LinkEditorProps = {
  link: Link;
  index: number;
  onChange: (index: number, field: keyof Link, value: string) => void;
  onRemove: (index: number) => void;
};

const iconOptions = [
  { value: 'github', label: 'GitHub', icon: <Github className="w-4 h-4 inline mr-1" /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4 inline mr-1" /> },
  { value: 'twitter', label: 'Twitter', icon: <Twitter className="w-4 h-4 inline mr-1" /> },
  { value: 'website', label: 'Website', icon: <Globe className="w-4 h-4 inline mr-1" /> },
  { value: 'default', label: 'Other', icon: <DefaultLink className="w-4 h-4 inline mr-1" /> },
];

export default function LinkEditor({ link, index, onChange, onRemove }: LinkEditorProps) {
  return (
    <div className="mb-4 border p-3 rounded bg-gray-50">
      <input
        className="w-full mb-1 p-1 border"
        placeholder="Title"
        value={link.title}
        onChange={(e) => onChange(index, 'title', e.target.value)}
      />
      <input
        className="w-full mb-1 p-1 border"
        placeholder="URL"
        value={link.url}
        onChange={(e) => onChange(index, 'url', e.target.value)}
      />
      <select
        className="w-full mb-1 p-1 border"
        value={link.icon}
        onChange={(e) => onChange(index, 'icon', e.target.value)}
      >
        {iconOptions.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={() => onRemove(index)}
        className="text-sm text-red-600 mt-1"
      >
        Remove
      </button>
    </div>
  );
}
