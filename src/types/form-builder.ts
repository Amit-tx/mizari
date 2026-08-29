// Advanced Form Builder Types

export type FieldType = 
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'url'
  | 'date'
  | 'time'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'rating'
  | 'file'
  | 'yes-no'
  | 'textarea'
  | 'password';

export type ValidationRule = 
  | 'required'
  | 'email'
  | 'url'
  | 'phone'
  | 'minLength'
  | 'maxLength'
  | 'minValue'
  | 'maxValue'
  | 'pattern'
  | 'custom';

export interface ValidationConfig {
  rule: ValidationRule;
  value?: string | number;
  message?: string;
}

export interface FormFieldOption {
  id: string;
  label: string;
  value: string;
  order: number;
  description?: string;
  isDisabled?: boolean;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  
  // Validation
  validations: ValidationConfig[];
  errorMessage?: string;
  
  // Type-specific
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  acceptFileTypes?: string[];
  maxFileSize?: number; // in MB
  
  // Options for dropdown/radio/checkbox
  options?: FormFieldOption[];
  
  // Rating field specific
  maxRating?: number;
  ratingStyle?: 'stars' | 'hearts' | 'smileys';
  
  // Conditional logic
  conditionalLogic?: {
    condition: ConditionalCondition;
    show: boolean; // true = show when condition met, false = hide when condition met
  };
  
  // UI
  order: number;
  width?: 'full' | 'half' | 'third'; // full width, half width, one-third width
  disabled?: boolean;
  hidden?: boolean;
}

export interface ConditionalCondition {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
  value?: string | number;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  order: number;
  isCollapsible: boolean;
  isCollapsed: boolean;
  backgroundColor?: string;
  borderColor?: string;
  icon?: string; // emoji or icon name
}

export interface FormStructure {
  sections: FormSection[];
  conditionalLogic: FormConditionalLogic[];
}

export interface FormConditionalLogic {
  id: string;
  conditions: ConditionalCondition[];
  actions: ConditionalAction[];
  operator: 'AND' | 'OR';
}

export interface ConditionalAction {
  type: 'show' | 'hide' | 'enable' | 'disable' | 'setValue' | 'clearValue';
  targetFieldId?: string;
  targetSectionId?: string;
  value?: string | number | boolean;
}

export interface FormFieldResponse {
  fieldId: string;
  fieldLabel: string;
  value: string | number | boolean | string[] | File;
  fieldType: FieldType;
  timestamp?: Date;
}

export interface FormConfig {
  title: string;
  description?: string;
  submitButtonText?: string;
  successMessage?: string;
  redirectUrl?: string;
  allowMultipleSubmissions?: boolean;
  collectEmail?: boolean;
  collectName?: boolean;
  
  // Styling
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  borderRadius?: string;
  
  // Settings
  isPublished?: boolean;
  isEnabled?: boolean;
}

export interface FormSubmission {
  formId: number;
  profileId: number;
  responseData: Record<string, FormFieldResponse>;
  submitterEmail?: string;
  submitterName?: string;
  submitterIp?: string;
  userAgent?: string;
  timestamp: Date;
}

// UI State
export interface FormBuilderState {
  formId?: number;
  config: FormConfig;
  structure: FormStructure;
  isSaving: boolean;
  isDraft: boolean;
  lastSaved?: Date;
  unsavedChanges: boolean;
}

export interface FormBuilderAction {
  type: 'ADD_SECTION' | 'DELETE_SECTION' | 'UPDATE_SECTION' |
         'ADD_FIELD' | 'DELETE_FIELD' | 'UPDATE_FIELD' |
         'ADD_OPTION' | 'DELETE_OPTION' | 'UPDATE_OPTION' |
         'REORDER_SECTIONS' | 'REORDER_FIELDS' | 'REORDER_OPTIONS' |
         'UPDATE_CONFIG' | 'SET_CONDITIONAL_LOGIC' | 'LOAD_FORM';
  payload?: any;
}
