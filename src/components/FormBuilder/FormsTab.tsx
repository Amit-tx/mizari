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

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/forms');
      if (res.ok) {
        const data = await res.json();
        setForms(data);
      }
    } catch (err) {
      console.error('Failed to load forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForm = async (data: any) => {
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          formId: selectedForm?.id,
        }),
      });

      if (res.ok) {
        await loadForms();
        setView('list');
        setSelectedForm(null);
      }
    } catch (err) {
      console.error('Failed to save form:', err);
      throw err;
    }
  };

  const handleDeleteForm = async (formId: number) => {
    if (!confirm('Delete this form?')) return;

    try {
      const res = await fetch(`/api/forms?formId=${formId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await loadForms();
      }
    } catch (err) {
      console.error('Failed to delete form:', err);
    }
  };

  const handlePublishForm = async (formId: number, isPublished: boolean) => {
    try {
      const form = forms.find(f => f.id === formId);
      if (!form) return;

      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            ...form,
            isPublished: !isPublished,
          },
          structure: JSON.parse(form.formStructure),
          slug: form.slug,
          formId,
        }),
      });

      if (res.ok) {
        await loadForms();
      }
    } catch (err) {
      console.error('Failed to publish form:', err);
    }
  };

  if (view === 'create' || view === 'edit') {
    return (
      <div>
        <button
          onClick={() => {
            setView('list');
            setSelectedForm(null);
          }}
          className="mb-6 px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
        >
          ← Back to Forms
        </button>
        <FormBuilder
          formId={selectedForm?.id}
          initialData={
            selectedForm
              ? {
                  config: {
                    title: selectedForm.title,
                    description: selectedForm.description,
                    submitButtonText: selectedForm.submitButtonText,
                    successMessage: selectedForm.successMessage,
                    redirectUrl: selectedForm.redirectUrl,
                    collectEmail: selectedForm.collectEmail === 1,
                    collectName: selectedForm.collectName === 1,
                    backgroundColor: selectedForm.backgroundColor,
                    textColor: selectedForm.textColor,
                    buttonColor: selectedForm.buttonColor,
                    borderRadius: selectedForm.borderRadius,
                    isPublished: selectedForm.isPublished === 1,
                    isEnabled: selectedForm.isEnabled === 1,
                  },
                  structure: JSON.parse(selectedForm.formStructure),
                }
              : undefined
          }
          profileId={profileId}
          onSave={handleSaveForm}
        />
      </div>
    );
  }

  if (view === 'responses' && selectedForm) {
    return (
      <div>
        <button
          onClick={() => {
            setView('list');
            setSelectedForm(null);
          }}
          className="mb-6 px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
        >
          ← Back to Forms
        </button>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedForm.title} - Responses
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Manage and view all submissions for this form
          </p>
        </div>
        <ResponsesManager
          formId={selectedForm.id}
          formStructure={JSON.parse(selectedForm.formStructure)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📋 Forms</h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Create custom forms for your audience
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedForm(null);
            setView('create');
          }}
          className="px-6 py-2 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          + New Form
        </button>
      </div>

      {/* Forms List */}
      {loading ? (
        <div className="text-center py-8 text-gray-600 dark:text-slate-400">
          Loading forms...
        </div>
      ) : forms.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-slate-700">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            No forms yet
          </h3>
          <p className="text-gray-600 dark:text-slate-400 mb-4">
            Create your first form to start collecting responses
          </p>
          <button
            onClick={() => {
              setSelectedForm(null);
              setView('create');
            }}
            className="px-6 py-2 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Create Form
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {form.title}
                  </h3>
                  {form.description && (
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                      {form.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {form.isPublished === 1 ? (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                      ✅ Published
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-semibold">
                      📝 Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Form Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {form.totalResponses}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-slate-400">Responses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {JSON.parse(form.formStructure).sections.reduce((sum: number, s: any) => sum + s.fields.length, 0)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-slate-400">Fields</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {JSON.parse(form.formStructure).sections.length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-slate-400">Sections</div>
                </div>
              </div>

              {/* Public URL */}
              {form.isPublished === 1 && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold mb-1">
                    Public URL
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/f/${username}/${form.slug}`}
                      readOnly
                      className="flex-1 px-3 py-1 bg-white dark:bg-slate-700 border border-blue-200 dark:border-blue-700 rounded text-xs"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/f/${username}/${form.slug}`
                        );
                        alert('Copied!');
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs font-semibold hover:bg-blue-600"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setSelectedForm(form);
                    setView('edit');
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => {
                    setSelectedForm(form);
                    setView('responses');
                  }}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-all"
                >
                  📊 Responses ({form.totalResponses})
                </button>

                <button
                  onClick={() => handlePublishForm(form.id, form.isPublished === 1)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-all"
                >
                  {form.isPublished === 1 ? '🔒 Unpublish' : '🚀 Publish'}
                </button>

                <button
                  onClick={() => handleDeleteForm(form.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
