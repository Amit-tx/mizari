'use client';

import { useState, useEffect } from 'react';
import { FormResponse } from '@/db/schema';

interface ResponsesManagerProps {
  formId: number;
  formStructure: any;
}

export default function ResponsesManager({ formId, formStructure }: ResponsesManagerProps) {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');
  const [filterStarred, setFilterStarred] = useState<'all' | 'starred' | 'unstarred'>('all');
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    starred: 0,
  });

  useEffect(() => {
    loadResponses();
  }, [search, filterRead, filterStarred, sortBy]);

  const loadResponses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(filterRead !== 'all' && { isRead: filterRead === 'read' ? '1' : '0' }),
        ...(filterStarred !== 'all' && { isStarred: filterStarred === 'starred' ? '1' : '0' }),
        sortBy,
      });

      const res = await fetch(`/api/forms/${formId}/responses?${params}`);
      
      if (!res.ok) {
        throw new Error('Failed to load responses');
      }

      const data = await res.json();
      setResponses(data);

      // Calculate stats
      setStats({
        total: data.length,
        unread: data.filter((r: any) => !r.isRead).length,
        starred: data.filter((r: any) => r.isStarred).length,
      });
    } catch (err) {
      console.error('Failed to load responses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (responseId: number, isRead: boolean) => {
    try {
      const res = await fetch(`/api/forms/${formId}/responses`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseId, isRead: !isRead }),
      });

      if (res.ok) {
        setResponses(responses.map(r => 
          r.id === responseId ? { ...r, isRead: !r.isRead } : r
        ));
      }
    } catch (err) {
      console.error('Failed to update response:', err);
    }
  };

  const handleToggleStar = async (responseId: number, isStarred: boolean) => {
    try {
      const res = await fetch(`/api/forms/${formId}/responses`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseId, isStarred: !isStarred }),
      });

      if (res.ok) {
        setResponses(responses.map(r => 
          r.id === responseId ? { ...r, isStarred: !r.isStarred } : r
        ));
      }
    } catch (err) {
      console.error('Failed to update response:', err);
    }
  };

  const handleDelete = async (responseId: number) => {
    if (!confirm('Delete this response?')) return;

    try {
      const res = await fetch(`/api/forms/${formId}/responses?responseId=${responseId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setResponses(responses.filter(r => r.id !== responseId));
        setSelectedResponse(null);
      }
    } catch (err) {
      console.error('Failed to delete response:', err);
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/forms/${formId}/responses?action=export`);
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `form-responses-${formId}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Failed to export:', err);
    }
  };

  const getFieldLabel = (fieldId: string) => {
    for (const section of formStructure.sections) {
      const field = section.fields.find((f: any) => f.id === fieldId);
      if (field) return field.label;
    }
    return fieldId;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-xs text-gray-600 dark:text-slate-400">Total Responses</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-yellow-600">{stats.unread}</div>
          <div className="text-xs text-gray-600 dark:text-slate-400">Unread</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-blue-600">{stats.starred}</div>
          <div className="text-xs text-gray-600 dark:text-slate-400">Starred</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
          />

          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value as any)}
            className="px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>

          <select
            value={filterStarred}
            onChange={(e) => setFilterStarred(e.target.value as any)}
            className="px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
          >
            <option value="all">All Stars</option>
            <option value="starred">Starred</option>
            <option value="unstarred">Not Starred</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gradient-to-r from-[#111827] to-[#111827] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Responses List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="text-center py-8 text-gray-600 dark:text-slate-400">
              Loading responses...
            </div>
          ) : responses.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-slate-400">
              No responses yet
            </div>
          ) : (
            <div className="space-y-2">
              {responses.map((response) => (
                <button
                  key={response.id}
                  onClick={() => setSelectedResponse(response)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedResponse?.id === response.id
                      ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300'
                  } ${!response.isRead ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {response.submitterName}
                      </span>
                      {response.isStarred && <span>⭐</span>}
                      {!response.isRead && <span className="text-yellow-600">●</span>}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {new Date(response.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {response.submitterEmail && (
                    <div className="text-sm text-gray-600 dark:text-slate-400">
                      {response.submitterEmail}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        {selectedResponse && (
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 h-fit sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Response Details</h3>
              <button
                onClick={() => setSelectedResponse(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleRead(selectedResponse.id, selectedResponse.isRead)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: selectedResponse.isRead ? '#f3f4f6' : '#fef3c7',
                    color: selectedResponse.isRead ? '#4b5563' : '#d97706',
                  }}
                >
                  {selectedResponse.isRead ? '🔓 Mark Unread' : '📖 Mark Read'}
                </button>

                <button
                  onClick={() => handleToggleStar(selectedResponse.id, selectedResponse.isStarred)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: selectedResponse.isStarred ? '#dbeafe' : '#f3f4f6',
                    color: selectedResponse.isStarred ? '#2563eb' : '#6b7280',
                  }}
                >
                  {selectedResponse.isStarred ? '⭐ Unstar' : '☆ Star'}
                </button>

                <button
                  onClick={() => handleDelete(selectedResponse.id)}
                  className="px-3 py-2 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all"
                >
                  🗑️
                </button>
              </div>

              {/* Info */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                <div className="text-xs text-gray-600 dark:text-slate-400 space-y-1">
                  <div><strong>Name:</strong> {selectedResponse.submitterName}</div>
                  <div><strong>Email:</strong> {selectedResponse.submitterEmail || '-'}</div>
                  <div><strong>IP:</strong> {selectedResponse.submitterIp}</div>
                  <div>
                    <strong>Submitted:</strong>{' '}
                    {new Date(selectedResponse.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Response Data */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Responses</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {Object.entries(selectedResponse.responseData).map(([fieldId, value]: [string, any]) => (
                    <div key={fieldId} className="text-sm">
                      <div className="font-semibold text-gray-700 dark:text-slate-300 text-xs mb-1">
                        {getFieldLabel(fieldId)}
                      </div>
                      <div className="text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-700 p-2 rounded break-words">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
