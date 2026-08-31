'use client';

import { useState } from 'react';
import { FormConfig, FormStructure } from '@/types/form-builder';
import FormPreview from '@/components/FormBuilder/FormPreview';

interface Props {
  formId: number;
  config: FormConfig;
  structure: FormStructure;
}

export default function PublicFormClient({ formId, config, structure }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (responseData: Record<string, any>) => {
    setError('');
    try {
      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responseData,
          submitterEmail: config.collectEmail ? responseData['form-email'] ?? '' : '',
          submitterName: config.collectName ? responseData['form-name'] ?? '' : '',
        }),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? 'Submission failed');
      }

      setSubmitted(true);

      if (config.redirectUrl) {
        setTimeout(() => { window.location.href = config.redirectUrl!; }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-5">✅</div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
            {config.successMessage || 'Thank you!'}
          </h1>
          {config.redirectUrl && (
            <p className="text-sm text-gray-500 dark:text-slate-400">Redirecting…</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-2xl">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <FormPreview
          config={config}
          structure={structure}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
