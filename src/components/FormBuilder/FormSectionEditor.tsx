'use client';

import { FormSection, FieldType } from '@/types/form-builder';

const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: 'text', label: 'Text', icon: '📝' },
  { type: 'textarea', label: 'Long Text', icon: '📄' },
  { type: 'number', label: 'Number', icon: '🔢' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'phone', label: 'Phone', icon: '📱' },
  { type: 'url', label: 'URL', icon: '🔗' },
  { type: 'date', label: 'Date', icon: '📅' },
  { type: 'time', label: 'Time', icon: '⏰' },
  { type: 'dropdown', label: 'Dropdown', icon: '📋' },
  { type: 'radio', label: 'Radio', icon: '⭕' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'rating', label: 'Rating', icon: '⭐' },
  { type: 'file', label: 'File Upload', icon: '📎' },
  { type: 'yes-no', label: 'Yes/No', icon: '❓' },
  { type: 'password', label: 'Password', icon: '🔐' },
];

interface FormSectionEditorProps {
  section: FormSection;
  selectedFieldId?: string | null;
  onUpdate: (updates: Partial<FormSection>) => void;
  onDelete: () => void;
  onAddField: (fieldType: FieldType) => void;
  onSelectField: (fieldId: string) => void;
}

export default function FormSectionEditor({
  section,
  selectedFieldId,
  onUpdate,
  onDelete,
  onAddField,
  onSelectField,
}: FormSectionEditorProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Section Header */}
      <div className="border-b border-gray-200 dark:border-slate-700 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={section.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="text-2xl font-bold bg-transparent text-gray-900 dark:text-white outline-none"
            placeholder="Section Title"
          />
          <button
            onClick={onDelete}
            className="ml-auto px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
            title="Delete section"
          >
            🗑️
          </button>
        </div>

        <textarea
          value={section.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Section description (optional)"
          className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white"
          rows={2}
        />
      </div>

      {/* Fields List */}
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Fields</h3>
        <div className="space-y-2">
          {section.fields.map((field, idx) => (
            <button
              key={field.id}
              onClick={() => onSelectField(field.id)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                selectedFieldId === field.id
                  ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500'
                  : 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>
                  {FIELD_TYPES.find(ft => ft.type === field.type)?.icon || '📝'}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {field.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    {field.type}{field.required && ' • Required'}
                  </div>
                </div>
                {selectedFieldId === field.id && <span className="text-blue-600">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Add Field Dropdown */}
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Add Field</h3>
        <div className="grid grid-cols-2 gap-2">
          {FIELD_TYPES.map((ft) => (
            <button
              key={ft.type}
              onClick={() => onAddField(ft.type)}
              className="px-3 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-sm font-semibold text-gray-900 dark:text-white transition-all"
            >
              {ft.icon} {ft.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Settings */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Section Settings</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={section.isCollapsible}
              onChange={(e) => onUpdate({ isCollapsible: e.target.checked })}
              className="rounded"
            />
            <span className="text-gray-900 dark:text-white">Collapsible</span>
          </label>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Background Color
            </label>
            <input
              type="color"
              value={section.backgroundColor || '#ffffff'}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
