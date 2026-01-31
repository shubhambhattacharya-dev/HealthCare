import React from 'react';
import { Calendar, Phone, Plus, ArrowRight } from 'lucide-react';

/**
 * ButtonEnhanced Component - Advanced button with loading states and accessibility
 *
 * Enhances the existing button component with better interactions,
 * loading states, and accessibility features.
 *
 * Features:
 * - Loading states with spinner
 * - Enhanced hover/focus animations
 * - Better accessibility (ARIA labels, keyboard navigation)
 * - Multiple variants (primary, secondary, outline, ghost, success, danger)
 * - Icon support with positioning
 * - Size variants (sm, md, lg)
 * - Full-width option
 *
 * @param {React.ReactNode} children - Button content
 * @param {string} variant - Button style variant
 * @param {string} size - Button size
 * @param {boolean} isLoading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {React.Component} icon - Icon component
 * @param {string} iconPosition - Icon position ('left' or 'right')
 * @param {boolean} fullWidth - Make button full width
 * @param {string} className - Additional CSS classes
 * @param {Function} onClick - Click handler
 * @param {Object} ...props - Standard button props
 */
const ButtonEnhanced = ({
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
  ...props
}) => {
  // Enhanced variant styles with better interaction states
  const variantStyles = {
    primary: `
      bg-primary-500 text-white
      hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25
      active:bg-primary-700 active:scale-[0.98]
      focus:ring-4 focus:ring-primary-100 focus:ring-offset-2 focus:ring-offset-white
      disabled:bg-primary-300 disabled:hover:bg-primary-300 disabled:shadow-none
      shadow-md hover:shadow-lg
    `,
    secondary: `
      bg-secondary-500 text-white
      hover:bg-secondary-600 hover:shadow-lg hover:shadow-secondary-500/25
      active:bg-secondary-700 active:scale-[0.98]
      focus:ring-4 focus:ring-secondary-100 focus:ring-offset-2 focus:ring-offset-white
      disabled:bg-secondary-300 disabled:hover:bg-secondary-300 disabled:shadow-none
      shadow-md hover:shadow-lg
    `,
    outline: `
      border-2 border-primary-500 text-primary-600 bg-transparent
      hover:bg-primary-50 hover:border-primary-600 hover:shadow-md hover:shadow-primary-500/10
      active:bg-primary-100 active:scale-[0.98]
      focus:ring-4 focus:ring-primary-100 focus:ring-offset-2 focus:ring-offset-white
      disabled:border-primary-300 disabled:text-primary-300 disabled:hover:bg-transparent
    `,
    ghost: `
      text-gray-700 bg-transparent
      hover:bg-gray-100 hover:shadow-sm
      active:bg-gray-200 active:scale-[0.98]
      focus:ring-4 focus:ring-gray-100 focus:ring-offset-2 focus:ring-offset-white
      disabled:text-gray-400 disabled:hover:bg-transparent
    `,
    success: `
      bg-success-500 text-white
      hover:bg-success-600 hover:shadow-lg hover:shadow-success-500/25
      active:bg-success-700 active:scale-[0.98]
      focus:ring-4 focus:ring-success-100 focus:ring-offset-2 focus:ring-offset-white
      disabled:bg-success-300 disabled:hover:bg-success-300 disabled:shadow-none
      shadow-md hover:shadow-lg
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25
      active:bg-red-700 active:scale-[0.98]
      focus:ring-4 focus:ring-red-100 focus:ring-offset-2 focus:ring-offset-white
      disabled:bg-red-300 disabled:hover:bg-red-300 disabled:shadow-none
      shadow-md hover:shadow-lg
    `
  };

  // Size variants
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-3',
    lg: 'px-8 py-4 text-lg gap-3'
  };

  // Base styles
  const baseStyles = `
    rounded-xl font-semibold
    transition-all duration-200 ease-out
    focus:outline-none
    disabled:cursor-not-allowed disabled:scale-100
    flex items-center justify-center
    relative overflow-hidden
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex-shrink-0 animate-spin">
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
    </div>
  );

  // Button content
  const buttonContent = (
    <>
      {/* Loading State */}
      {isLoading && <LoadingSpinner />}

      {/* Left Icon */}
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className="flex-shrink-0 w-4 h-4" />
      )}

      {/* Button Text */}
      <span className={isLoading ? 'opacity-75' : ''}>
        {children}
      </span>

      {/* Right Icon */}
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="flex-shrink-0 w-4 h-4" />
      )}
    </>
  );

  // Handle click with loading prevention
  const handleClick = (e) => {
    if (isLoading || disabled) return;
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${!disabled && !isLoading ? 'hover:scale-105 active:scale-95 transition-transform' : ''}`}
      {...props}
    >
      {buttonContent}
    </button>
  );
};

// Pre-configured button variants for common use cases
export const ButtonVariants = {
  // Primary actions
  Primary: (props) => <ButtonEnhanced variant="primary" {...props} />,
  PrimaryLarge: (props) => <ButtonEnhanced variant="primary" size="lg" {...props} />,

  // Secondary actions
  Secondary: (props) => <ButtonEnhanced variant="secondary" {...props} />,
  SecondaryLarge: (props) => <ButtonEnhanced variant="secondary" size="lg" {...props} />,

  // Outline style
  Outline: (props) => <ButtonEnhanced variant="outline" {...props} />,
  OutlineLarge: (props) => <ButtonEnhanced variant="outline" size="lg" {...props} />,

  // Ghost style
  Ghost: (props) => <ButtonEnhanced variant="ghost" {...props} />,

  // Status buttons
  Success: (props) => <ButtonEnhanced variant="success" {...props} />,
  Danger: (props) => <ButtonEnhanced variant="danger" {...props} />,

  // Common actions
  BookAppointment: (props) => (
    <ButtonEnhanced
      variant="primary"
      icon={Calendar}
      iconPosition="left"
      {...props}
    >
      Book Appointment
    </ButtonEnhanced>
  ),

  ContactDoctor: (props) => (
    <ButtonEnhanced
      variant="outline"
      icon={Phone}
      iconPosition="left"
      {...props}
    >
      Contact Doctor
    </ButtonEnhanced>
  ),

  ViewProfile: (props) => (
    <ButtonEnhanced
      variant="ghost"
      size="sm"
      {...props}
    >
      View Profile
    </ButtonEnhanced>
  )
};

// Usage examples for documentation
export const ButtonExamples = () => (
  <div className="space-y-6 p-6">
    <h3 className="text-lg font-semibold mb-4">ButtonEnhanced Examples</h3>

    {/* Variants */}
    <div className="space-y-3">
      <h4 className="font-medium">Variants</h4>
      <div className="flex flex-wrap gap-3">
        <ButtonEnhanced variant="primary">Primary</ButtonEnhanced>
        <ButtonEnhanced variant="secondary">Secondary</ButtonEnhanced>
        <ButtonEnhanced variant="outline">Outline</ButtonEnhanced>
        <ButtonEnhanced variant="ghost">Ghost</ButtonEnhanced>
        <ButtonEnhanced variant="success">Success</ButtonEnhanced>
        <ButtonEnhanced variant="danger">Danger</ButtonEnhanced>
      </div>
    </div>

    {/* Sizes */}
    <div className="space-y-3">
      <h4 className="font-medium">Sizes</h4>
      <div className="flex items-center gap-3">
        <ButtonEnhanced variant="primary" size="sm">Small</ButtonEnhanced>
        <ButtonEnhanced variant="primary" size="md">Medium</ButtonEnhanced>
        <ButtonEnhanced variant="primary" size="lg">Large</ButtonEnhanced>
      </div>
    </div>

    {/* With Icons */}
    <div className="space-y-3">
      <h4 className="font-medium">With Icons</h4>
      <div className="flex flex-wrap gap-3">
        <ButtonEnhanced variant="primary" icon={Plus} iconPosition="left">
          Add Item
        </ButtonEnhanced>
        <ButtonEnhanced variant="outline" icon={ArrowRight} iconPosition="right">
          Continue
        </ButtonEnhanced>
      </div>
    </div>

    {/* Loading States */}
    <div className="space-y-3">
      <h4 className="font-medium">Loading States</h4>
      <div className="flex flex-wrap gap-3">
        <ButtonEnhanced variant="primary" isLoading>
          Saving...
        </ButtonEnhanced>
        <ButtonEnhanced variant="outline" isLoading>
          Processing...
        </ButtonEnhanced>
      </div>
    </div>

    {/* Disabled States */}
    <div className="space-y-3">
      <h4 className="font-medium">Disabled States</h4>
      <div className="flex flex-wrap gap-3">
        <ButtonEnhanced variant="primary" disabled>
          Disabled
        </ButtonEnhanced>
        <ButtonEnhanced variant="outline" disabled>
          Disabled
        </ButtonEnhanced>
      </div>
    </div>

    {/* Full Width */}
    <div className="space-y-3">
      <h4 className="font-medium">Full Width</h4>
      <ButtonEnhanced variant="primary" fullWidth>
        Full Width Button
      </ButtonEnhanced>
    </div>
  </div>
);

export default ButtonEnhanced;
