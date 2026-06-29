'use client';

import { useState } from 'react';
import type { Link } from '@/db/schema';

interface LinkCardProps {
  link: Link;
  onUpdate: (id: number, title: string, url: string) => void;
  onDelete: (id: number) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function LinkCard({ link, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: LinkCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);

  const handleSave = () => {
    onUpdate(link.id, title, url);
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(link.title);
    setUrl(link.url);
    setEditing(false);
  };

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      {editing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder="Link title"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            placeholder="https://..."
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="rounded-lg bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-3 py-1.5 text-xs font-medium text-white transition-all hover:brightness-110">Save</button>
            <button onClick={handleCancel} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">{link.title}</h3>
            <p className="truncate text-xs text-gray-500 dark:text-slate-400">{link.url}</p>
          </div>
          <div className="flex items-center gap-1.5 pl-3">
            <span className="whitespace-nowrap rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-slate-700 dark:text-slate-300">{link.clicks} clicks</span>
            <button onClick={() => onMoveUp(link.id)} disabled={isFirst} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-slate-700 dark:hover:text-slate-200" aria-label="Move up">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/></svg>
            </button>
            <button onClick={() => onMoveDown(link.id)} disabled={isLast} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-slate-700 dark:hover:text-slate-200" aria-label="Move down">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <button onClick={() => setEditing(true)} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700 dark:hover:text-slate-200" aria-label="Edit">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button onClick={() => onDelete(link.id)} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400" aria-label="Delete">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
