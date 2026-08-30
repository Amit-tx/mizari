'use client';

import { useState, useEffect } from 'react';
import { FormBuilder } from '@/components/FormBuilder';
import ResponsesManager from '@/components/FormBuilder/ResponsesManager';

interface FormsTabProps {
  profileId: number;
  username: string;
}

export default function FormsTab({ profileId, username }: FormsTabProps) {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'responses'>('list');
  const [selectedForm, setSelectedForm] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => { loadForms(); }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/forms');
      if (res.ok) setForms(await res.json());
    } catch (err) {
      console.error('Failed to load forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForm = async (data: any) => {
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, formId: selectedForm?.id }),
    });
    if (!res.ok) throw new Error('Save failed');
    await loadForms();
    setView('list');
    setSelectedForm(null);
    showToast(selectedForm ? '✅ Form updated!' : '✅ Form created!');
  };

  const handleDelete = async (formId: number) => {
    if (!confirm('Delete this form permanently?')) return;
    const res = await fetch(`/api/forms?formId=${formId}`, { method: 'DELETE' });
    if (res.ok) { await loadForms(); showToast('🗑️ Form deleted'); }
  };

  const handleTogglePublish = async (form: any) => {
    // formStructure already an object from API — no JSON.parse needed
    const res = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        config: { ...form, isPublished: form.isPublished !== 1 },
        structure: form.formStructure,   // already object
        slug: form.slug,                 // preserve existing slug
        formId: form.id,
      }),
    });
    if (res.ok) {
      await loadForms();
      showToast(form.isPublished === 1 ? '🔒 Unpublished' : '🚀 Published!');
    }
  };

  const copyLink = (form: any) => {
    navigator.clipboard.writeText(`${window.location.origin}/f/${username}/${form.slug}`);
    showToast('📋 Link copied!');
  };

  // ─── Build / Edit view ──────────────────────────────────────────────────────
  if (view === 'create' || view === 'edit') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => { setView('list'); setSelectedForm(null); }}
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Back to Forms
        </button>

        <FormBuilder
          formId={selectedForm?.id}
          existingSlug={selectedForm?.slug}
          initialData={
            selectedForm ? {
              config: {
                title: selectedForm.title,
                description: selectedForm.description,
                submitButtonText: selectedForm.submitButtonText,
                successMessage: selectedForm.successMessage,
                redirectUrl: selectedForm.redirectUrl,
                collectEmail: selectedForm.collectEmail === 1,
                collectName: selectedForm.collectName === 1,
                allowMultipleSubmissions: selectedForm.allowMultipleSubmissions !== 0,
                backgroundColor: selectedForm.backgroundColor,
                textColor: selectedForm.textColor,
                buttonColor: selectedForm.buttonColor,
                borderRadius: selectedForm.borderRadius,
                isPublished: selectedForm.isPublished === 1,
                isEnabled: selectedForm.isEnabled !== 0,
              },
              structure: selectedForm.formStructure,  // already object — no JSON.parse
            } : undefined
          }
          profileId={profileId}
          onSave={handleSaveForm}
        />
      </div>
    );
  }

  // ─── Responses view ─────────────────────────────────────────────────────────
  if (view === 'responses' && selectedForm) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => { setView('list'); setSelectedForm(null); }}
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Back to Forms
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedForm.title}</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Responses</p>
        </div>
        <ResponsesManager
          formId={selectedForm.id}
          formStructure={selectedForm.formStructure}  // already object
        />
      </div>
    );
  }

  // ─── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl shadow-xl animate-pulse">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Forms</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">Collect responses from your audience</p>
        </div>
        <button
          onClick={() => { setSelectedForm(null); setView('create'); }}
          className="px-4 py-2 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
        >
          + New Form
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 rounded-full border-2 border-[#FF6B6B] border-t-transparent animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && forms.length === 0 && (
        <div className="text-center py-14 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
          <div className="text-5xl mb-3">📋</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No forms yet</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">Create a form to start collecting responses</p>
          <button
            onClick={() => { setSelectedForm(null); setView('create'); }}
            className="px-5 py-2.5 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Create your first form
          </button>
        </div>
      )}

      {/* Forms list */}
      {!loading && forms.length > 0 && (
        <div className="space-y-3">
          {forms.map((form) => {
            // formStructure is already an object — no JSON.parse needed
            const structure = form.formStructure;
            const totalFields = structure?.sections?.reduce((n: number, s: any) => n + s.fields.length, 0) ?? 0;

            return (
              <div
                key={form.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
              >
                {/* Top row */}
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{form.title}</h3>
                      {form.description && (
                        <p className="text-sm text-gray-500 dark:text-slate-400 truncate mt-0.5">{form.description}</p>
                      )}
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${
                      form.isPublished === 1
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    }`}>
                      {form.isPublished === 1 ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-4 mt-3 text-sm">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">{form.totalResponses ?? 0}</span>
                      <span className="text-gray-400 ml-1">responses</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">{totalFields}</span>
                      <span className="text-gray-400 ml-1">fields</span>
                    </div>
                  </div>

                  {/* Public link (if published) */}
                  {form.isPublished === 1 && (
                    <div className="mt-3 flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <span className="text-xs text-blue-600 dark:text-blue-400 truncate flex-1">
                        /f/{username}/{form.slug}
                      </span>
                      <button
                        onClick={() => copyLink(form)}
                        className="shrink-0 text-xs px-2.5 py-1 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedForm(form); setView('edit'); }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => { setSelectedForm(form); setView('responses'); }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    📊 {form.totalResponses ?? 0} Responses
                  </button>
                  <button
                    onClick={() => handleTogglePublish(form)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      form.isPublished === 1
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                    }`}
                  >
                    {form.isPublished === 1 ? '🔒 Unpublish' : '🚀 Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
