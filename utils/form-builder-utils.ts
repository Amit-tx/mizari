import { FormField, FormSection, FormStructure, ConditionalCondition, ValidationConfig, FieldType } from '@/types/form-builder';

/**
 * Generate unique ID for form elements
 */
export const generateId = (prefix: string = ''): string => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate phone number (basic)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Check if field value meets validation rules
 */
export const validateFieldValue = (
  value: any,
  field: FormField
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (field.required && (!value || value.toString().trim() === '')) {
    errors.push(field.errorMessage || `${field.label} is required`);
    return { isValid: false, errors };
  }

  if (!value && !field.required) return { isValid: true, errors: [] };

  // Inline validation rules
  for (const validation of (field.validations ?? [])) {
    const msg = validation.message || `Validation failed for ${field.label}`;
    let err: string | null = null;
    switch (validation.rule) {
      case 'email':    err = !isValidEmail(value) ? msg : null; break;
      case 'url':      err = !isValidUrl(value) ? msg : null; break;
      case 'phone':    err = !isValidPhone(value) ? msg : null; break;
      case 'minLength': err = value.toString().length < (validation.value || 0) ? msg : null; break;
      case 'maxLength': err = value.toString().length > (validation.value || 0) ? msg : null; break;
      case 'minValue':  err = Number(value) < Number(validation.value || 0) ? msg : null; break;
      case 'maxValue':  err = Number(value) > Number(validation.value || 0) ? msg : null; break;
      case 'pattern':   err = !new RegExp(validation.value as string).test(value) ? msg : null; break;
    }
    if (err) errors.push(err);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate against a single rule
 */



export const createEmptySection = (title: string = 'New Section'): FormSection => ({
  id: generateId('section-'),
  title,
  description: '',
  fields: [],
  order: 0,
  isCollapsible: false,
  isCollapsed: false,
});

/**
 * Create empty form field
 */
export const createEmptyField = (type: FieldType = 'text'): FormField => ({
  id: generateId('field-'),
  type,
  label: 'New Field',
  placeholder: '',
  helpText: '',
  required: false,
  validations: [],
  order: 0,
  width: 'full',
  ...(type === 'dropdown' || type === 'radio' || type === 'checkbox' ? {
    options: [],
  } : {}),
  ...(type === 'rating' ? {
    maxRating: 5,
    ratingStyle: 'stars',
  } : {}),
  ...(type === 'file' ? {
    acceptFileTypes: ['*'],
    maxFileSize: 10,
  } : {}),
});

/**
 * Calculate form completion percentage
 */

export const exportFormResponsesToCSV = (
  responses: Array<{
    id: number;
    submitterName: string;
    submitterEmail: string;
    responseData: Record<string, any>;
    createdAt: Date;
  }>,
  fieldLabels: Record<string, string>
): string => {
  if (responses.length === 0) {
    return '';
  }

  // Get all unique field IDs
  const allFieldIds = new Set<string>();
  responses.forEach(response => {
    Object.keys(response.responseData).forEach(fieldId => {
      allFieldIds.add(fieldId);
    });
  });

  // Create header
  const headers = ['Submission ID', 'Name', 'Email', 'Submitted At', ...Array.from(allFieldIds).map(id => fieldLabels[id] || id)];
  
  // Create rows
  const rows = responses.map(response => {
    const values = [
      response.id,
      response.submitterName || 'Anonymous',
      response.submitterEmail || '',
      response.createdAt.toISOString(),
      ...Array.from(allFieldIds).map(fieldId => {
        const value = response.responseData[fieldId];
        return Array.isArray(value) ? value.join('; ') : value || '';
      }),
    ];
    return values.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

/**
 * Validate form structure
 */
export const validateFormStructure = (structure: FormStructure): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!structure.sections || structure.sections.length === 0) {
    errors.push('Form must have at least one section');
  }

  structure.sections.forEach((section, sectionIndex) => {
    if (!section.title || section.title.trim() === '') {
      errors.push(`Section ${sectionIndex + 1} must have a title`);
    }

    if (!section.fields || section.fields.length === 0) {
      errors.push(`Section "${section.title}" must have at least one field`);
    }

    section.fields.forEach((field, fieldIndex) => {
      if (!field.label || field.label.trim() === '') {
        errors.push(`Field ${fieldIndex + 1} in section "${section.title}" must have a label`);
      }

      if (['dropdown', 'radio', 'checkbox'].includes(field.type) && (!field.options || field.options.length === 0)) {
        errors.push(`${field.type} field "${field.label}" must have at least one option`);
      }
    });
  });

  return { isValid: errors.length === 0, errors };
};

/**
 * Clone form structure
 */

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
};
