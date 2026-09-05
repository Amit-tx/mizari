'use client';

import { useState, useReducer } from 'react';
import {
  FormField, FormSection, FormStructure, FormConfig,
  FieldType, FormBuilderAction, FormBuilderState,
} from '@/types/form-builder';
import {
  createEmptySection, createEmptyField,
  validateFormStructure, generateSlug,
} from '@/utils/form-builder-utils';
import FormPreview from './FormPreview';
import FormSettings from './FormSettings';

interface FormBuilderProps {
  formId?: number;
  initialData?: { config: FormConfig; structure: FormStructure };
  profileId: number;
  onSave: (data: { config: FormConfig; structure: FormStructure; slug: string }) => Promise<void>;
  existingSlug?: string;
}

const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: 'text',     label: 'Text',       icon: '📝' },
  { type: 'textarea', label: 'Paragraph',  icon: '📄' },
  { type: 'email',    label: 'Email',      icon: '✉️' },
  { type: 'phone',    label: 'Phone',      icon: '📱' },
  { type: 'number',   label: 'Number',     icon: '🔢' },
  { type: 'dropdown', label: 'Dropdown',   icon: '▼' },
  { type: 'radio',    label: 'Choice',     icon: '◎' },
  { type: 'checkbox', label: 'Checkbox',   icon: '☑️' },
  { type: 'date',     label: 'Date',       icon: '📅' },
  { type: 'rating',   label: 'Rating',     icon: '⭐' },
  { type: 'yes-no',   label: 'Yes / No',   icon: '✅' },
  { type: 'url',      label: 'URL',        icon: '🔗' },
];

const defaultConfig: FormConfig = {
  title: 'New Form',
  description: '',
  submitButtonText: 'Submit',
  successMessage: 'Thank you for your submission!',
  redirectUrl: '',
  allowMultipleSubmissions: true,
  collectEmail: false,
  collectName: false,
  backgroundColor: '#ffffff',
  textColor: '#1a1a1a',
  buttonColor: '#111827',
  borderRadius: 'rounded-lg',
  isPublished: false,
  isEnabled: true,
};

function formReducer(state: FormBuilderState, action: FormBuilderAction): FormBuilderState {
  switch (action.type) {
    case 'ADD_SECTION': {
      const s = createEmptySection();
      s.order = state.structure.sections.length;
      return { ...state, unsavedChanges: true, structure: { ...state.structure, sections: [...state.structure.sections, s] } };
    }
    case 'DELETE_SECTION':
      return { ...state, unsavedChanges: true, structure: { ...state.structure, sections: state.structure.sections.filter(s => s.id !== action.payload) } };
    case 'UPDATE_SECTION':
      return { ...state, unsavedChanges: true, structure: { ...state.structure, sections: state.structure.sections.map(s => s.id === action.payload.sectionId ? { ...s, ...action.payload.updates } : s) } };
    case 'ADD_FIELD': {
      const f = action.payload.field || createEmptyField();
      f.order = state.structure.sections.find(s => s.id === action.payload.sectionId)?.fields.length ?? 0;
      return { ...state, unsavedChanges: true, structure: { ...state.structure, sections: state.structure.sections.map(s => s.id === action.payload.sectionId ? { ...s, fields: [...s.fields, f] } : s) } };
    }
    case 'DELETE_FIELD':
      return { ...state, unsavedChanges: true, structure: { ...state.structure, sections: state.structure.sections.map(s => s.id === action.payload.sectionId ? { ...s, fields: s.fields.filter(f => f.id !== action.payload.fieldId) } : s) } };
    case 'UPDATE_FIELD':
      return { ...state, unsavedChanges: true, structure: { ...state.structure, sections: state.structure.sections.map(s => s.id === action.payload.sectionId ? { ...s, fields: s.fields.map(f => f.id === action.payload.fieldId ? { ...f, ...action.payload.updates } : f) } : s) } };
    case 'UPDATE_CONFIG':
      return { ...state, unsavedChanges: true, config: { ...state.config, ...action.payload } };
    default:
      return state;
  }
}

export default function FormBuilder({ formId, initialData, onSave, existingSlug }: FormBuilderProps) {
  const [state, dispatch] = useReducer(formReducer, {
    config: initialData?.config ?? defaultConfig,
    structure: initialData?.structure ?? { sections: [createEmptySection('Section 1')], conditionalLogic: [] },
    isSaving: false,
    isDraft: !(initialData?.config?.isPublished),
    unsavedChanges: false,
  });

  const [activeTab, setActiveTab] = useState<'build' | 'preview' | 'settings'>('build');
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>(state.structure.sections[0]?.id ?? '');
  const [editingField, setEditingField] = useState<{ sectionId: string; field: FormField } | null>(null);
  const [showFieldPicker, setShowFieldPicker] = useState<string | null>(null); // sectionId

  const handleSave = async () => {
    const v = validateFormStructure(state.structure);
    if (!v.isValid) { alert(v.errors.join('\n')); return; }
    setSaving(true);
    try {
      // Preserve existing slug when editing
      const slug = existingSlug || generateSlug(state.config.title || 'form');
      await onSave({ config: state.config, structure: state.structure, slug });
    } catch {
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="min-w-0 flex-1 mr-4">
          <input
            value={state.config.title}
            onChange={e => dispatch({ type: 'UPDATE_CONFIG', payload: { title: e.target.value } })}
            placeholder="Form title…"
            className="w-full text-lg font-bold bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="shrink-0 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#111827] to-[#111827] text-white hover:shadow-lg transition-all disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        {(['build', 'preview', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-[#111827] text-[#111827]'
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab === 'build' ? '🏗️ Build' : tab === 'preview' ? '👁️ Preview' : '⚙️ Settings'}
          </button>
        ))}
      </div>

      {/* Build tab */}
      {activeTab === 'build' && (
        <div className="p-4 space-y-4">
          {/* Sections */}
          {state.structure.sections.map((section, sIdx) => (
            <div key={section.id} className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
              {/* Section header */}
              <div
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-slate-800 cursor-pointer"
                onClick={() => setExpandedSection(expandedSection === section.id ? '' : section.id)}
              >
                <span className="text-gray-400 text-sm">{expandedSection === section.id ? '▼' : '▶'}</span>
                <input
                  value={section.title}
                  onChange={e => {
                    e.stopPropagation();
                    dispatch({ type: 'UPDATE_SECTION', payload: { sectionId: section.id, updates: { title: e.target.value } } });
                  }}
                  onClick={e => e.stopPropagation()}
                  placeholder={`Section ${sIdx + 1}`}
                  className="flex-1 font-semibold text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none"
                />
                <span className="text-xs text-gray-400">{section.fields.length} fields</span>
                {state.structure.sections.length > 1 && (
                  <button
                    onClick={e => { e.stopPropagation(); if (confirm('Delete this section?')) dispatch({ type: 'DELETE_SECTION', payload: section.id }); }}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors"
                    title="Delete section"
                  >
                    🗑️
                  </button>
                )}
              </div>

              {/* Section body */}
              {expandedSection === section.id && (
                <div className="p-3 space-y-2">
                  {/* Fields */}
                  {section.fields.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-4">No fields yet. Add one below.</p>
                  )}
                  {section.fields.map((field) => (
                    <div
                      key={field.id}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:border-[#111827]/50 transition-all cursor-pointer"
                      onClick={() => setEditingField({ sectionId: section.id, field })}
                    >
                      <span className="text-base">{FIELD_TYPES.find(t => t.type === field.type)?.icon ?? '📝'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {field.label || '(no label)'}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        <p className="text-xs text-gray-400">{field.type}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => { e.stopPropagation(); dispatch({ type: 'DELETE_FIELD', payload: { sectionId: section.id, fieldId: field.id } }); }}
                          className="p-1 text-red-400 hover:text-red-600"
                          title="Delete"
                        >🗑️</button>
                      </div>
                    </div>
                  ))}

                  {/* Add field */}
                  {showFieldPicker === section.id ? (
                    <div className="mt-2">
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {FIELD_TYPES.map(ft => (
                          <button
                            key={ft.type}
                            onClick={() => {
                              const f = createEmptyField(ft.type);
                              dispatch({ type: 'ADD_FIELD', payload: { sectionId: section.id, field: f } });
                              setEditingField({ sectionId: section.id, field: f });
                              setShowFieldPicker(null);
                            }}
                            className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-[#111827] hover:bg-[#111827]/5 transition-all text-center"
                          >
                            <span className="text-xl">{ft.icon}</span>
                            <span className="text-xs text-gray-700 dark:text-slate-300">{ft.label}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowFieldPicker(null)}
                        className="mt-2 w-full text-sm text-gray-400 hover:text-gray-600 py-1"
                      >Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowFieldPicker(section.id)}
                      className="w-full mt-1 px-3 py-2 text-sm font-semibold text-[#111827] border-2 border-dashed border-[#111827]/40 rounded-lg hover:border-[#111827] hover:bg-[#111827]/5 transition-all"
                    >
                      + Add Field
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add section */}
          <button
            onClick={() => {
              dispatch({ type: 'ADD_SECTION' });
              const newId = state.structure.sections.at(-1)?.id;
              if (newId) setExpandedSection(newId);
            }}
            className="w-full py-2.5 text-sm font-semibold text-gray-600 dark:text-slate-400 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl hover:border-gray-400 dark:hover:border-slate-500 hover:text-gray-800 dark:hover:text-white transition-all"
          >
            + Add Section
          </button>
        </div>
      )}

      {/* Preview tab */}
      {activeTab === 'preview' && (
        <div className="p-4">
          <FormPreview
            config={state.config}
            structure={state.structure}
            onSubmit={() => alert('Preview mode — form not submitted.')}
          />
        </div>
      )}

      {/* Settings tab */}
      {activeTab === 'settings' && (
        <div className="p-4">
          <FormSettings
            config={state.config}
            onUpdate={updates => dispatch({ type: 'UPDATE_CONFIG', payload: updates })}
          />
        </div>
      )}

      {/* Field Editor Modal */}
      {editingField && (
        <FieldEditorModal
          sectionId={editingField.sectionId}
          field={editingField.field}
          onUpdate={(updates) => {
            dispatch({ type: 'UPDATE_FIELD', payload: { sectionId: editingField.sectionId, fieldId: editingField.field.id, updates } });
            setEditingField(prev => prev ? { ...prev, field: { ...prev.field, ...updates } } : null);
          }}
          onClose={() => setEditingField(null)}
        />
      )}
    </div>
  );
}

// ─── Inline Field Editor Modal ───────────────────────────────────────────────

function FieldEditorModal({
  field, onUpdate, onClose,
}: {
  sectionId: string;
  field: FormField;
  onUpdate: (u: Partial<FormField>) => void;
  onClose: () => void;
}) {
  const hasOptions = ['dropdown', 'radio', 'checkbox'].includes(field.type);
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    const opt = newOption.trim();
    if (!opt) return;
    const newOpt = { id: `opt-${Date.now()}`, label: opt, value: opt.toLowerCase().replace(/\s+/g, '_'), order: (field.options ?? []).length };
    onUpdate({ options: [...(field.options ?? []), newOpt] });
    setNewOption('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="font-bold text-gray-900 dark:text-white">Edit Field</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Label */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Label *</label>
            <input
              value={field.label}
              onChange={e => onUpdate({ label: e.target.value })}
              placeholder="Question label"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#111827]"
            />
          </div>

          {/* Placeholder */}
          {!hasOptions && field.type !== 'rating' && field.type !== 'yes-no' && (
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Placeholder</label>
              <input
                value={field.placeholder ?? ''}
                onChange={e => onUpdate({ placeholder: e.target.value })}
                placeholder="Hint text…"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#111827]"
              />
            </div>
          )}

          {/* Required toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => onUpdate({ required: !field.required })}
              className={`relative w-10 h-5 rounded-full transition-colors ${field.required ? 'bg-[#111827]' : 'bg-gray-300 dark:bg-slate-600'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${field.required ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Required field</span>
          </label>

          {/* Options (dropdown/radio/checkbox) */}
          {hasOptions && (
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Options</label>
              <div className="space-y-2">
                {(field.options ?? []).map((opt, i) => (
                  <div key={opt.id ?? i} className="flex items-center gap-2">
                    <input
                      value={opt.label}
                      onChange={e => {
                        const opts = [...(field.options ?? [])];
                        opts[i] = { ...opts[i], label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') };
                        onUpdate({ options: opts });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#111827]"
                    />
                    <button
                      onClick={() => onUpdate({ options: (field.options ?? []).filter((_, j) => j !== i) })}
                      className="text-red-400 hover:text-red-600 px-1"
                    >✕</button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    value={newOption}
                    onChange={e => setNewOption(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addOption()}
                    placeholder="Add option…"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#111827]"
                  />
                  <button
                    onClick={addOption}
                    className="px-3 py-1.5 rounded-lg bg-[#111827]/10 text-[#111827] text-sm font-semibold hover:bg-[#111827]/20"
                  >Add</button>
                </div>
              </div>
            </div>
          )}

          {/* Help text */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Help text (optional)</label>
            <input
              value={field.helpText ?? ''}
              onChange={e => onUpdate({ helpText: e.target.value })}
              placeholder="Extra hint shown below the field"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#111827]"
            />
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#111827] to-[#111827] text-white font-bold hover:shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export { FormBuilder };
