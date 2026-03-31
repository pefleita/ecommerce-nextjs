import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
          {label}
          {props.required && <span className="text-danger-600 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full h-9 px-3 text-sm bg-white text-neutral-900',
          'border rounded-lg transition-colors duration-150',
          'placeholder:text-neutral-400',
          error
            ? 'border-danger-600 focus:border-danger-600 focus:ring-1 focus:ring-danger-600'
            : 'border-neutral-200 focus:border-accent-500 focus:ring-1 focus:ring-accent-500',
          'disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed',
          'outline-none',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-danger-600" role="alert">{error}</p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-neutral-500">{hint}</p>
      )}
    </div>
  )
)
Input.displayName = 'Input'
