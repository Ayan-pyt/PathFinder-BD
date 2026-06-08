import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export default function Input({
  label,
  icon,
  error,
  type = 'text',
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider pl-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none transition-colors duration-200">
            {icon}
          </div>
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={`w-full glass-input py-3 pl-${icon ? '11' : '4'} pr-${isPassword ? '10' : '4'} text-sm text-slate-900 placeholder-slate-400 transition-all ${
            error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-600 font-medium pl-1 mt-0.5">{error}</span>}
    </div>
  );
}
