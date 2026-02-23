'use client'

interface FormFieldProps {
  label: string
  field: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'select'
  required?: boolean
  options?: string[]
  value: string
  onChange: (value: string) => void
  error?: string
}

export const FormField = ({
  label,
  field,
  type = 'text',
  required = true,
  options,
  value,
  onChange,
  error
}: FormFieldProps) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-slate-700 mb-1">
      {label} {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      {type === 'select' ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-sm ${
            error 
              ? 'border-red-300 bg-red-50' 
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <option value="">Select {label}</option>
          {options?.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter your ${label.toLowerCase()}`}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-sm ${
            error 
              ? 'border-red-300 bg-red-50' 
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        />
      )}
      {value && !error && (
        <div className="absolute right-2 top-2.5">
          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
      )}
    </div>
    {error && (
      <div className="mt-1 flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg">
        <span className="w-3 h-3 bg-red-400 rounded-full flex items-center justify-center mr-1.5 flex-shrink-0">
          <span className="text-white text-xs">!</span>
        </span>
        {error}
      </div>
    )}
  </div>
)
