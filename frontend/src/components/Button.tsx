import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = "font-body-md text-[16px] leading-[24px] font-semibold py-4 rounded-lg shadow-sm active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-surface-tint",
    secondary: "bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/90",
    outline: "border border-outline text-primary hover:bg-surface-container",
    text: "text-on-surface-variant font-body-md text-body-md px-4 py-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 shadow-none"
  };

  const widthClass = fullWidth && variant !== 'text' ? 'w-full' : '';

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
    </button>
  );
}
