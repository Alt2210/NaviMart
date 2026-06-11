import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
}

export default function Input({ label, icon, className = '', id, ...props }: InputProps) {
  const inputId = id || props.name;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block font-body-md text-body-md text-on-surface mb-2" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="material-symbols-outlined text-outline">{icon}</span>
          </span>
        )}
        <input
          id={inputId}
          className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-3 bg-transparent border border-[#C1C1C1] rounded-none focus:ring-1 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface placeholder-outline-variant transition-colors ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
