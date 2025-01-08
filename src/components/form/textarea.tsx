interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-200">
        {label}
      </label>
      <textarea
        {...props}
        className={`w-full px-4 py-2 bg-[#2c2d32] text-white rounded-lg
          border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent
          placeholder-gray-500 ${className}`}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}