import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Enhanced variant styles with proper interaction states
  const variantStyles = {
    primary: `
      bg-primary-500 text-white
      hover:bg-primary-600 hover:shadow-lg
      active:bg-primary-700
      focus:ring-primary-500
      shadow-md hover:shadow-lg
    `,
    secondary: `
      bg-secondary-500 text-white
      hover:bg-secondary-600 hover:shadow-lg
      active:bg-secondary-700
      focus:ring-secondary-500
      shadow-md hover:shadow-lg
    `,
    outline: `
      border-2 border-primary-500 text-primary-600 bg-transparent
      hover:bg-primary-50 hover:border-primary-600 hover:shadow-md
      active:bg-primary-100
      focus:ring-primary-500
    `,
    ghost: `
      text-gray-700 bg-transparent
      hover:bg-gray-100 hover:shadow-sm
      active:bg-gray-200
      focus:ring-gray-500
    `,
    success: `
      bg-success-500 text-white
      hover:bg-success-600 hover:shadow-lg
      active:bg-success-700
      focus:ring-success-500
      shadow-md hover:shadow-lg
    `,
    warning: `
      bg-warning-500 text-white
      hover:bg-warning-600 hover:shadow-lg
      active:bg-warning-700
      focus:ring-warning-500
      shadow-md hover:shadow-lg
    `,
    error: `
      bg-error-500 text-white
      hover:bg-error-600 hover:shadow-lg
      active:bg-error-700
      focus:ring-error-500
      shadow-md hover:shadow-lg
    `,
  };

  // Consistent size styles using spacing system
  const sizeStyles = {
    xs: 'px-3 py-2 text-sm font-medium',      // 12px x 8px
    sm: 'px-4 py-2.5 text-sm font-medium',    // 16px x 10px
    md: 'px-6 py-3 text-base font-semibold',  // 24px x 12px
    lg: 'px-8 py-4 text-lg font-semibold',    // 32px x 16px
    xl: 'px-10 py-5 text-xl font-semibold',   // 40px x 20px
  };

  // Base styles with enhanced focus and interaction
  const baseStyles = `
    inline-flex items-center justify-center
    rounded-xl font-medium
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
    active:scale-[0.98]
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
      `}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {Icon && iconPosition === 'left' && <Icon className="h-5 w-5" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="h-5 w-5" />}
        </div>
      )}
    </button>
  );
};

export default Button;