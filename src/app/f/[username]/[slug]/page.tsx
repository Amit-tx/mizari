'use client';

import { useState, useEffect } from 'react';
import { FormConfig, FormStructure } from '@/types/form-builder';
import FormPreview from '@/components/FormBuilder/FormPreview';

export default function PublicFormPage({ params }: { params: { username: string; slug: string } }) {
  const [form, setForm] = useState<{
    id: number;
    config: FormConfig;
    structure: FormStructure;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    loadForm();
  }, [params.slug]);

  const loadForm = async () => {
    try {
      const res = await fetch(`/api/forms/${params.slug}?slug=${params.slug}`);
      
      if (!res.ok) {
        setError('Form not found');
        return;
      }

      const data = await res.json();
      
      // Parse formStructure if it's a string
      const structure = typeof data.formStructure === 'string' 
        ? JSON.parse(data.formStructure) 
        : data.formStructure;

      setForm({
        id: data.id,
        config: {
          title: data.title,
          description: data.description,
          submitButtonText: data.submitButtonText,
          successMessage: data.successMessage,
          redirectUrl: data.redirectUrl,
          collectEmail: data.collectEmail === 1,
          collectName: data.collectName === 1,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
          buttonColor: data.buttonColor,
          borderRadius: data.borderRadius,
        },
        structure,
      });

      setSuccessMessage(data.successMessage);
      setRedirectUrl(data.redirectUrl);
    } catch (err) {
      console.error('Failed to load form:', err);
      setError('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (responseData: Record<string, any>) => {
    if (!form) return;

    try {
      // Collect email and name if form requires it
      const submitterEmail = form.config.collectEmail
        ? responseData['form-email'] || ''
        : '';
      const submitterName = form.config.collectName
        ? responseData['form-name'] || ''
        : '';

      const res = await fetch(`/api/forms/${form.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responseData,
          submitterEmail,
          submitterName,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Submission failed');
      }

      const result = await res.json();
      setSubmitted(true);

      // Redirect if URL provided
      if (result.redirectUrl) {
        setTimeout(() => {
          window.location.href = result.redirectUrl;
        }, 2000);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Submission failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">😕</h1>
          <p className="text-gray-600 dark:text-slate-400">{error || 'Form not found'}</p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Back Home
          </a>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {(form.config.successMessage || 'Thank you').split('!')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mb-4">
            {redirectUrl ? 'Redirecting...' : 'Thank you for your submission.'}
          </p>
          {!redirectUrl && (
            <a
              href="/"
              className="inline-block px-6 py-2 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Back Home
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <FormPreview
          config={form.config}
          structure={form.structure}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
