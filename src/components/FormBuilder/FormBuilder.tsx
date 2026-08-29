'use client';

import { useState, useCallback, useReducer, useEffect } from 'react';
import { FormField, FormSection, FormStructure, FormConfig, FieldType, FormBuilderAction, FormBuilderState } from '@/types/form-builder';
import {
  generateId,
  createEmptySection,
  createEmptyField,
  validateFormStructure,
  generateSlug,
} from '@/utils/form-builder-utils';
import FormSectionEditor from './FormSectionEditor';
import FormFieldEditor from './FormFieldEditor';
import FormPreview from './FormPreview';
import FormSettings from './FormSettings';

interface FormBuilderProps {
  formId?: number;
  initialData?: {
    config: FormConfig;
    structure: FormStructure;
  };
  profileId: number;
  onSave: (data: { config: FormConfig; structure: FormStructure; slug: string }) => Promise<void>;
}

const initialState: FormBuilderState = {
  config: {
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
    buttonColor: '#FF6B6B',
    borderRadius: 'rounded-lg',
    isPublished: false,
    isEnabled: true,
  },
  structure: {
    sections: [createEmptySection('Section 1')],
    conditionalLogic: [],
  },
  isSaving: false,
  isDraft: true,
  unsavedChanges: false,
};

const formBuilderReducer = (state: FormBuilderState, action: FormBuilderAction): FormBuilderState => {
  let newState = { ...state };

  switch (action.type) {
    // SECTION OPERATIONS
    case 'ADD_SECTION': {
      const newSection = action.payload || createEmptySection();
      newSection.order = state.structure.sections.length;
      newState.structure = {
        ...state.structure,
        sections: [...state.structure.sections, newSection],
      };
      break;
    }

    case 'DELETE_SECTION': {
      const sectionId = action.payload;
      newState.structure = {
        ...state.structure,
        sections: state.structure.sections.filter(s => s.id !== sectionId),
      };
      break;
    }

    case 'UPDATE_SECTION': {
      const { sectionId, updates } = action.payload;
      newState.structure = {
        ...state.structure,
        sections: state.structure.sections.map(s =>
          s.id === sectionId ? { ...s, ...updates } : s
        ),
      };
      break;
    }

    case 'REORDER_SECTIONS': {
      const { fromIndex, toIndex } = action.payload;
      const sections = [...state.structure.sections];
      const [movedSection] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, movedSection);
      sections.forEach((s, i) => (s.order = i));
      newState.structure = { ...state.structure, sections };
      break;
    }

    // FIELD OPERATIONS
    case 'ADD_FIELD': {
      const { sectionId, field } = action.payload;
      newState.structure = {
        ...state.structure,
        sections: state.structure.sections.map(s => {
          if (s.id === sectionId) {
            const newField = field || createEmptyField();
            newField.order = s.fields.length;
            return { ...s, fields: [...s.fields, newField] };
          }
          return s;
        }),
      };
      break;
    }

    case 'DELETE_FIELD': {
      const { sectionId, fieldId } = action.payload;
      newState.structure = {
        ...state.structure,
        sections: state.structure.sections.map(s => {
          if (s.id === sectionId) {
            return { ...s, fields: s.fields.filter(f => f.id !== fieldId) };
          }
          return s;
        }),
      };
      break;
    }

    case 'UPDATE_FIELD': {
      const { sectionId, fieldId, updates } = action.payload;
      newState.structure = {
        ...state.structure,
        sections: state.structure.sections.map(s => {
          if (s.id === sectionId) {
            return {
              ...s,
              fields: s.fields.map(f =>
                f.id === fieldId ? { ...f, ...updates } : f
              ),
            };
          }
          return s;
        }),
      };
      break;
    }

    case 'REORDER_FIELDS': {
      const { sectionId, fromIndex, toIndex } = action.payload;
      newState.structure = {
        ...state.structure,
        sections: state.structure.sections.map(s => {
          if (s.id === sectionId) {
            const fields = [...s.fields];
            const [movedField] = fields.splice(fromIndex, 1);
            fields.splice(toIndex, 0, movedField);
            fields.forEach((f, i) => (f.order = i));
            return { ...s, fields };
          }
          return s;
        }),
      };
      break;
    }

    case 'UPDATE_CONFIG': {
      newState.config = { ...state.config, ...action.payload };
      break;
    }

    case 'LOAD_FORM': {
      const { config, structure } = action.payload;
      newState = {
        ...state,
        config,
        structure,
        isDraft: !config.isPublished,
      };
      break;
    }
  }

  return {
    ...newState,
    unsavedChanges: true,
  };
};

export default function FormBuilder({
  formId,
  initialData,
  profileId,
  onSave,
}: FormBuilderProps) {
  const [state, dispatch] = useReducer(formBuilderReducer, initialData ? {
    ...initialState,
    ...initialData,
    formId,
  } : {
    ...initialState,
    formId,
  });

  const [activeTab, setActiveTab] = useState<'build' | 'preview' | 'settings'>('build');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    state.structure.sections[0]?.id || null
  );
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const handleSave = async () => {
    // Validate form structure
    const validation = validateFormStructure(state.structure);
    if (!validation.isValid) {
      alert(`Form has errors:\n${validation.errors.join('\n')}`);
      return;
    }

    try {
      const slug = generateSlug(state.config.title || 'form');
      await onSave({
        config: state.config,
        structure: state.structure,
        slug,
      });
      dispatch({ type: 'UPDATE_CONFIG', payload: { isPublished: !state.isDraft } });
    } catch (error) {
      console.error('Failed to save form:', error);
      alert('Failed to save form. Please try again.');
    }
  };

  const handleAddSection = () => {
    dispatch({ type: 'ADD_SECTION' });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      dispatch({ type: 'DELETE_SECTION', payload: sectionId });
      setSelectedSectionId(null);
      setSelectedFieldId(null);
    }
  };

  const handleAddField = (sectionId: string, fieldType: FieldType) => {
    const newField = createEmptyField(fieldType);
    dispatch({
      type: 'ADD_FIELD',
      payload: { sectionId, field: newField },
    });
    setSelectedFieldId(newField.id);
  };

  const handleUpdateField = (sectionId: string, fieldId: string, updates: Partial<FormField>) => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: { sectionId, fieldId, updates },
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {state.config.title}
          </h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            {state.isDraft ? '📝 Draft' : '✅ Published'} • {state.structure.sections[0]?.fields.length || 0} fields
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!state.unsavedChanges}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${
            state.unsavedChanges
              ? 'bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white hover:shadow-lg'
              : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400 cursor-not-allowed'
          }`}
        >
          {state.isSaving ? 'Saving...' : 'Save Form'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 flex gap-4">
        {(['build', 'preview', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold transition-all border-b-2 ${
              activeTab === tab
                ? 'border-[#FF6B6B] text-[#FF6B6B]'
                : 'border-transparent text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab === 'build' && '🏗️ Build'}
            {tab === 'preview' && '👁️ Preview'}
            {tab === 'settings' && '⚙️ Settings'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'build' && (
          <div className="flex h-full gap-4 p-4">
            {/* Sections Sidebar */}
            <div className="w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-y-auto flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Sections</h3>
                <button
                  onClick={handleAddSection}
                  className="w-full px-3 py-2 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  + Add Section
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {state.structure.sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedSectionId === section.id
                        ? 'bg-[#FF6B6B] text-white shadow-md'
                        : 'bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    <div className="font-semibold">{section.title || `Section ${idx + 1}`}</div>
                    <div className="text-xs opacity-75 mt-1">{section.fields.length} fields</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Editor */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-y-auto">
              {selectedSectionId && (
                <FormSectionEditor
                  section={state.structure.sections.find(s => s.id === selectedSectionId)!}
                  onUpdate={(updates) =>
                    dispatch({
                      type: 'UPDATE_SECTION',
                      payload: { sectionId: selectedSectionId, updates },
                    })
                  }
                  onDelete={() => handleDeleteSection(selectedSectionId)}
                  onAddField={(fieldType) => handleAddField(selectedSectionId, fieldType)}
                  onSelectField={setSelectedFieldId}
                  selectedFieldId={selectedFieldId}
                />
              )}
            </div>

            {/* Field Editor */}
            {selectedFieldId && selectedSectionId && (
              <div className="w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-y-auto">
                <FormFieldEditor
                  field={state.structure.sections
                    .find(s => s.id === selectedSectionId)
                    ?.fields.find(f => f.id === selectedFieldId)!}
                  onUpdate={(updates) => handleUpdateField(selectedSectionId, selectedFieldId, updates)}
                  onDelete={() => {
                    dispatch({
                      type: 'DELETE_FIELD',
                      payload: { sectionId: selectedSectionId, fieldId: selectedFieldId },
                    });
                    setSelectedFieldId(null);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="overflow-y-auto p-6 flex justify-center">
            <FormPreview
              config={state.config}
              structure={state.structure}
              onSubmit={(data) => {
                console.log('Form submission:', data);
                alert('Form submitted! (Preview mode)');
              }}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="overflow-y-auto p-6">
            <FormSettings
              config={state.config}
              onUpdate={(updates) =>
                dispatch({ type: 'UPDATE_CONFIG', payload: updates })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
