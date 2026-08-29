'use client';

import { useState } from 'react';
import { FormConfig, FormStructure, FormField } from '@/types/form-builder';
import { validateFieldValue, getVisibleFields } from '@/utils/form-builder-utils';

interface FormPreviewProps {
  config: FormConfig;
  structure: FormStructure;
  onSubmit: (data: Record<string, any>) => void;
}

export default function FormPreview({
  config,
  structure,
  onSubmit,
}: FormPreviewProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value,
    }));
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string[]> = {};

    // Validate all fields
    structure.sections.forEach(section => {
      section.fields.forEach(field => {
        const validation = validateFieldValue(formValues[field.id], field);
        if (!validation.isValid) {
          newErrors[field.id] = validation.errors;
        }
      });
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formValues);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="w-full max-w-2xl rounded-2xl shadow-lg overflow-hidden"
      style={{ backgroundColor: config.backgroundColor }}
    >
      {/* Form Header */}
      <div className="p-8 border-b border-gray-200">
        <h1 className="text-3xl font-bold mb-2" style={{ color: config.textColor }}>
          {config.title}
        </h1>
        {config.description && (
          <p className="text-gray-600" style={{ color: config.textColor }}>
            {config.description}
          </p>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {structure.sections.map((section) => (
          <div key={section.id}>
            {section.title && (
              <h2 className="text-2xl font-bold mb-4" style={{ color: config.textColor }}>
                {section.title}
              </h2>
            )}
            {section.description && (
              <p className="text-gray-600 mb-4">{section.description}</p>
            )}

            <div className="space-y-6">
              {section.fields.map((field) => (
                <FormFieldInput
                  key={field.id}
                  field={field}
                  value={formValues[field.id] || ''}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  error={errors[field.id]?.[0]}
                  textColor={config.textColor}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: config.buttonColor }}
        >
          {submitting ? 'Submitting...' : config.submitButtonText}
        </button>
      </form>
    </div>
  );
}

function FormFieldInput({
  field,
  value,
  onChange,
  error,
  textColor,
}: {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  textColor?: string;
}) {
  return (
    <div>
      <label className="block font-semibold mb-2" style={{ color: textColor }}>
        {field.label}
        {field.required && <span className="text-red-600"> *</span>}
      </label>

      {field.helpText && (
        <p className="text-sm text-gray-600 mb-2">{field.helpText}</p>
      )}

      {field.type === 'text' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      )}

      {field.type === 'email' && (
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {field.type === 'number' && (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {field.type === 'date' && (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {field.type === 'dropdown' && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select an option</option>
          {field.options?.map(opt => (
            <option key={opt.id} value={opt.value || opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {field.type === 'checkbox' && (
        <div className="space-y-2">
          {field.options?.map(opt => (
            <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(value || []).includes(opt.value || opt.label)}
                onChange={(e) => {
                  const newValue = value || [];
                  if (e.target.checked) {
                    onChange([...newValue, opt.value || opt.label]);
                  } else {
                    onChange(newValue.filter((v: string) => v !== (opt.value || opt.label)));
                  }
                }}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {field.type === 'radio' && (
        <div className="space-y-2">
          {field.options?.map(opt => (
            <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value={opt.value || opt.label}
                checked={value === (opt.value || opt.label)}
                onChange={(e) => onChange(e.target.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {field.type === 'rating' && (
        <div className="flex gap-2">
          {Array.from({ length: field.maxRating || 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i + 1)}
              className={`text-2xl transition-all ${
                value > i ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ⭐
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-red-600 text-sm mt-2">⚠️ {error}</p>}
    </div>
  );
}
