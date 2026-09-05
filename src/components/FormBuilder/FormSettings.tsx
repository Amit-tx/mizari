'use client';

import { FormConfig } from '@/types/form-builder';

interface FormSettingsProps {
  config: FormConfig;
  onUpdate: (updates: Partial<FormConfig>) => void;
}

export default function FormSettings({
  config,
  onUpdate,
}: FormSettingsProps) {
  return (
    <div className="max-w-2xl space-y-8">
      {/* Basic Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Basic Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Form Title
            </label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Description
            </label>
            <textarea
              value={config.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Submit Button Text
            </label>
            <input
              type="text"
              value={config.submitButtonText || 'Submit'}
              onChange={(e) => onUpdate({ submitButtonText: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* After Submission */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          After Submission
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Success Message
            </label>
            <textarea
              value={config.successMessage || ''}
              onChange={(e) => onUpdate({ successMessage: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Redirect URL (Optional)
            </label>
            <input
              type="url"
              value={config.redirectUrl || ''}
              onChange={(e) => onUpdate({ redirectUrl: e.target.value })}
              placeholder="https://example.com/thank-you"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Form Behavior */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Form Behavior
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.allowMultipleSubmissions !== false}
              onChange={(e) => onUpdate({ allowMultipleSubmissions: e.target.checked })}
              className="rounded"
            />
            <span className="text-gray-900 dark:text-white">
              Allow multiple submissions from same person
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.collectEmail !== false}
              onChange={(e) => onUpdate({ collectEmail: e.target.checked })}
              className="rounded"
            />
            <span className="text-gray-900 dark:text-white">
              Collect email address
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.collectName !== false}
              onChange={(e) => onUpdate({ collectName: e.target.checked })}
              className="rounded"
            />
            <span className="text-gray-900 dark:text-white">
              Collect name
            </span>
          </label>
        </div>
      </div>

      {/* Styling */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Styling
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.backgroundColor || '#ffffff'}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="h-12 rounded-lg cursor-pointer border-2 border-gray-200"
              />
              <span className="text-sm text-gray-600 dark:text-slate-400">
                {config.backgroundColor}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Text Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.textColor || '#1a1a1a'}
                onChange={(e) => onUpdate({ textColor: e.target.value })}
                className="h-12 rounded-lg cursor-pointer border-2 border-gray-200"
              />
              <span className="text-sm text-gray-600 dark:text-slate-400">
                {config.textColor}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Button Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.buttonColor || '#111827'}
                onChange={(e) => onUpdate({ buttonColor: e.target.value })}
                className="h-12 rounded-lg cursor-pointer border-2 border-gray-200"
              />
              <span className="text-sm text-gray-600 dark:text-slate-400">
                {config.buttonColor}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Border Radius
            </label>
            <select
              value={config.borderRadius || 'rounded-lg'}
              onChange={(e) => onUpdate({ borderRadius: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
            >
              <option value="rounded-none">Sharp</option>
              <option value="rounded-md">Mild</option>
              <option value="rounded-lg">Medium</option>
              <option value="rounded-xl">Round</option>
              <option value="rounded-full">Full</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Status
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.isPublished !== false}
              onChange={(e) => onUpdate({ isPublished: e.target.checked })}
              className="rounded"
            />
            <span className="text-gray-900 dark:text-white">
              Published (accessible via public link)
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.isEnabled !== false}
              onChange={(e) => onUpdate({ isEnabled: e.target.checked })}
              className="rounded"
            />
            <span className="text-gray-900 dark:text-white">
              Enabled (accepting submissions)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
