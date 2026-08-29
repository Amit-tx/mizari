'use client';

import { FormField, FormFieldOption } from '@/types/form-builder';
import { generateId } from '@/utils/form-builder-utils';

interface FormFieldEditorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
}

export default function FormFieldEditor({
  field,
  onUpdate,
  onDelete,
}: FormFieldEditorProps) {
  const addOption = () => {
    const newOption: FormFieldOption = {
      id: generateId('opt-'),
      label: 'New Option',
      value: '',
      order: (field.options || []).length,
    };
    onUpdate({ options: [...(field.options || []), newOption] });
  };

  const updateOption = (id: string, updates: Partial<FormFieldOption>) => {
    onUpdate({
      options: (field.options || []).map(opt =>
        opt.id === id ? { ...opt, ...updates } : opt
      ),
    });
  };

  const deleteOption = (id: string) => {
    onUpdate({ options: (field.options || []).filter(opt => opt.id !== id) });
  };

  const hasOptions = ['dropdown', 'radio', 'checkbox'].includes(field.type);

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Edit Field
        </h3>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Basic Info */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Help Text
          </label>
          <textarea
            value={field.helpText || ''}
            onChange={(e) => onUpdate({ helpText: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
            rows={2}
          />
        </div>
      </div>

      {/* Validation */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
        <h4 className="font-bold text-gray-900 dark:text-white mb-3">Validation</h4>
        
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className="rounded"
            />
            <span className="text-gray-900 dark:text-white">Required field</span>
          </label>

          {field.type === 'text' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Min Length
                </label>
                <input
                  type="number"
                  value={field.minLength || ''}
                  onChange={(e) => onUpdate({ minLength: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-2 py-1 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Max Length
                </label>
                <input
                  type="number"
                  value={field.maxLength || ''}
                  onChange={(e) => onUpdate({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-2 py-1 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded"
                />
              </div>
            </>
          )}

          {field.type === 'number' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Min Value
                </label>
                <input
                  type="number"
                  value={field.minValue || ''}
                  onChange={(e) => onUpdate({ minValue: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-2 py-1 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Max Value
                </label>
                <input
                  type="number"
                  value={field.maxValue || ''}
                  onChange={(e) => onUpdate({ maxValue: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-2 py-1 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Error Message
            </label>
            <input
              type="text"
              value={field.errorMessage || ''}
              onChange={(e) => onUpdate({ errorMessage: e.target.value })}
              className="w-full px-2 py-1 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded"
              placeholder="Custom error message"
            />
          </div>
        </div>
      </div>

      {/* Options */}
      {hasOptions && (
        <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-gray-900 dark:text-white">Options</h4>
            <button
              onClick={addOption}
              className="px-2 py-1 text-sm bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white rounded-lg"
            >
              + Add
            </button>
          </div>

          <div className="space-y-2">
            {(field.options || []).map((option) => (
              <div key={option.id} className="flex gap-2">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => updateOption(option.id, { label: e.target.value })}
                  placeholder="Label"
                  className="flex-1 px-2 py-1 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-sm"
                />
                <button
                  onClick={() => deleteOption(option.id)}
                  className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Settings */}
      {field.type === 'rating' && (
        <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
          <h4 className="font-bold text-gray-900 dark:text-white mb-3">Rating Settings</h4>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-2">
              Max Rating
            </label>
            <input
              type="number"
              value={field.maxRating || 5}
              onChange={(e) => onUpdate({ maxRating: parseInt(e.target.value) })}
              min="1"
              max="10"
              className="w-full px-2 py-1 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded"
            />
          </div>
        </div>
      )}

      {/* File Settings */}
      {field.type === 'file' && (
        <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
          <h4 className="font-bold text-gray-900 dark:text-white mb-3">File Settings</h4>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-2">
              Max File Size (MB)
            </label>
            <input
              type="number"
              value={field.maxFileSize || 10}
              onChange={(e) => onUpdate({ maxFileSize: parseInt(e.target.value) })}
              className="w-full px-2 py-1 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
