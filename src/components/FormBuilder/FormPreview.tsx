'use client';

import { useState } from 'react';
import { FormConfig, FormStructure, FormField } from '@/types/form-builder';
import { validateFieldValue } from '@/utils/form-builder-utils';

interface FormPreviewProps {
  config: FormConfig;
  structure: FormStructure;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
}

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#FF6B6B]';

export default function FormPreview({ config, structure, onSubmit }: FormPreviewProps) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (id: string, val: any) => {
    setValues(p => ({ ...p, [id]: val }));
    setErrors(p => { const e = { ...p }; delete e[id]; return e; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    structure.sections.forEach(sec =>
      sec.fields.forEach(field => {
        const v = validateFieldValue(values[field.id], field);
        if (!v.isValid) newErrors[field.id] = v.errors[0];
      })
    );
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setSubmitting(true);
    try { await onSubmit(values); } finally { setSubmitting(false); }
  };

  const btnColor = config.buttonColor || '#FF6B6B';

  return (
    <div className="w-full max-w-xl mx-auto overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-900 dark:shadow-slate-900/50">
      {/* Header */}
      <div
        className="px-8 py-7"
        style={{ background: `linear-gradient(135deg, ${btnColor}18 0%, ${btnColor}08 100%)`, borderBottom: `1px solid ${btnColor}20` }}
      >
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{config.title}</h1>
        {config.description && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">{config.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-7 space-y-6">
        {/* Collect Name/Email */}
        {config.collectName && (
          <Field label="Your Name" required error={errors['form-name']}>
            <input type="text" className={inputCls} placeholder="Full name"
              value={values['form-name'] || ''}
              onChange={e => set('form-name', e.target.value)} />
          </Field>
        )}
        {config.collectEmail && (
          <Field label="Your Email" required error={errors['form-email']}>
            <input type="email" className={inputCls} placeholder="email@example.com"
              value={values['form-email'] || ''}
              onChange={e => set('form-email', e.target.value)} />
          </Field>
        )}

        {/* Sections */}
        {structure.sections.map((section, si) => (
          <div key={section.id}>
            {/* Section divider (skip for first if no name) */}
            {(section.title || si > 0) && (
              <div className="flex items-center gap-3 mb-5">
                {section.title && (
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-400 dark:text-slate-500 shrink-0">
                    {section.title}
                  </h2>
                )}
                <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
              </div>
            )}

            <div className="space-y-5">
              {section.fields.map(field => (
                <Field
                  key={field.id}
                  label={field.label}
                  required={field.required}
                  helpText={field.helpText}
                  error={errors[field.id]}
                >
                  <FieldInput
                    field={field}
                    value={values[field.id]}
                    onChange={val => set(field.id, val)}
                    btnColor={btnColor}
                  />
                </Field>
              ))}
            </div>
          </div>
        ))}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl py-3.5 text-sm font-extrabold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.98] disabled:opacity-60"
          style={{ backgroundColor: btnColor }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Submitting…
            </span>
          ) : (config.submitButtonText || 'Submit')}
        </button>
      </form>
    </div>
  );
}

/* ── Field wrapper ─────────────────────────────────────────────────────────── */
function Field({ label, required, helpText, error, children }: {
  label: string; required?: boolean; helpText?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
        {label}
        {required && <span className="ml-1 text-[#FF6B6B]">*</span>}
      </label>
      {helpText && <p className="text-xs text-gray-400 dark:text-slate-500">{helpText}</p>}
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

/* ── Every field type ──────────────────────────────────────────────────────── */
function FieldInput({ field, value, onChange, btnColor }: {
  field: FormField; value: any; onChange: (v: any) => void; btnColor: string;
}) {
  const v = value ?? '';

  switch (field.type) {
    case 'text':
      return <input type="text" className={inputCls} placeholder={field.placeholder || ''} value={v} onChange={e => onChange(e.target.value)} />;

    case 'textarea':
      return <textarea className={inputCls} placeholder={field.placeholder || ''} value={v} onChange={e => onChange(e.target.value)} rows={4} style={{ resize: 'vertical' }} />;

    case 'email':
      return <input type="email" className={inputCls} placeholder={field.placeholder || 'email@example.com'} value={v} onChange={e => onChange(e.target.value)} />;

    case 'phone':
      return <input type="tel" className={inputCls} placeholder={field.placeholder || '+91 00000 00000'} value={v} onChange={e => onChange(e.target.value)} />;

    case 'number':
      return <input type="number" className={inputCls} placeholder={field.placeholder || '0'} value={v} onChange={e => onChange(e.target.value)} />;

    case 'url':
      return <input type="url" className={inputCls} placeholder={field.placeholder || 'https://'} value={v} onChange={e => onChange(e.target.value)} />;

    case 'date':
      return <input type="date" className={inputCls} value={v} onChange={e => onChange(e.target.value)} />;

    case 'time':
      return <input type="time" className={inputCls} value={v} onChange={e => onChange(e.target.value)} />;

    case 'password':
      return <input type="password" className={inputCls} placeholder={field.placeholder || '••••••••'} value={v} onChange={e => onChange(e.target.value)} />;

    case 'dropdown':
      return (
        <select className={inputCls} value={v} onChange={e => onChange(e.target.value)}>
          <option value="">Select an option…</option>
          {field.options?.map(opt => (
            <option key={opt.id} value={opt.value || opt.label}>{opt.label}</option>
          ))}
        </select>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          {field.options?.map(opt => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
              <div
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                style={{ borderColor: v === (opt.value || opt.label) ? btnColor : '#D1D5DB' }}
              >
                {v === (opt.value || opt.label) && (
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: btnColor }} />
                )}
              </div>
              <input type="radio" name={field.id} value={opt.value || opt.label} checked={v === (opt.value || opt.label)}
                onChange={e => onChange(e.target.value)} className="sr-only" />
              <span className="text-sm text-gray-700 dark:text-slate-300">{opt.label}</span>
            </label>
          ))}
        </div>
      );

    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map(opt => {
            const checked = (v || []).includes(opt.value || opt.label);
            return (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer">
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all"
                  style={{ borderColor: checked ? btnColor : '#D1D5DB', backgroundColor: checked ? btnColor : 'transparent' }}
                >
                  {checked && <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <input type="checkbox" checked={checked}
                  onChange={e => {
                    const cur = v || [];
                    const val = opt.value || opt.label;
                    onChange(e.target.checked ? [...cur, val] : cur.filter((x: string) => x !== val));
                  }} className="sr-only" />
                <span className="text-sm text-gray-700 dark:text-slate-300">{opt.label}</span>
              </label>
            );
          })}
        </div>
      );

    case 'rating':
      const max = field.maxRating || 5;
      return (
        <div className="flex gap-2">
          {Array.from({ length: max }).map((_, i) => (
            <button key={i} type="button" onClick={() => onChange(i + 1)}
              className="text-2xl transition-all hover:scale-110 active:scale-95"
              style={{ color: (v || 0) > i ? '#FBBF24' : '#D1D5DB' }}>
              ★
            </button>
          ))}
          {v > 0 && <span className="ml-2 text-sm text-gray-500 self-center">{v}/{max}</span>}
        </div>
      );

    case 'yes-no':
      return (
        <div className="flex gap-3">
          {['Yes', 'No'].map(opt => (
            <button key={opt} type="button"
              onClick={() => onChange(opt)}
              className="flex-1 rounded-xl border-2 py-2.5 text-sm font-bold transition-all"
              style={{
                borderColor: v === opt ? btnColor : '#E5E7EB',
                backgroundColor: v === opt ? `${btnColor}15` : 'transparent',
                color: v === opt ? btnColor : '#6B7280',
              }}>
              {opt === 'Yes' ? '✓ Yes' : '✗ No'}
            </button>
          ))}
        </div>
      );

    case 'file':
      return (
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-6 transition-all hover:border-[#FF6B6B]/50 hover:bg-[#FF6B6B]/5 dark:border-slate-700">
          <span className="text-2xl">📎</span>
          <span className="text-sm text-gray-500">Click to upload a file</span>
          <input type="file" className="sr-only" onChange={e => onChange(e.target.files?.[0])} />
          {v && <span className="text-xs text-green-600 font-medium">✓ {(v as File).name}</span>}
        </label>
      );

    default:
      return <input type="text" className={inputCls} placeholder={field.placeholder || ''} value={v} onChange={e => onChange(e.target.value)} />;
  }
}
