import React from 'react';

interface MultilineInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}

export function MultilineInput({
  label,
  value,
  onChange,
  placeholder,
  minRows = 4
}: MultilineInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={minRows}
        className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
}