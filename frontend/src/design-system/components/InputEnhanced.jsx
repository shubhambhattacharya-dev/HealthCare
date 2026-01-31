import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle, Mail, Lock, Phone, Search, Loader } from 'lucide-react';

/**
 * InputEnhanced Component - Advanced form input with validation feedback
 *
 * Solves the critical issue of poor form feedback and user experience.
 * Provides comprehensive state management for form interactions.
 *
 * Features:
 * - Focus/error/success states with visual feedback
 * - Password show/hide toggle
 * - Helper text and validation messages
 * - Loading states
 * - Accessibility support
 * - Consistent design system integration
 *
 * @param {string} label - Input label
 * @param {string} error - Error message
 * @param {string} success - Success message
 * @param {string} helperText - Helper text
 * @param {boolean} showPasswordToggle - Show password visibility toggle
 * @param {boolean} isLoading - Show loading state
 * @param {React.Component} icon - Left icon component
 * @param {string} className - Additional CSS classes
 * @param {Object} ...props - Standard input props
 */
const InputEnhanced = ({
  label,
  error,
  success,
  helperText,
  showPasswordToggle = false,
  isLoading = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Determine input state for styling
  const getInputState = () => {
    if (error) return 'error';
    if (success) return 'success';
    if (isFocused) return 'focus';
    return 'default';
  };

  const state = getInputState();

  // State-based styling
  const stateStyles = {
    default: {
      container: 'border-gray-300 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-100',
      label: 'text-gray-900',
      input: 'text-gray-900 placeholder:text-gray-400',
      helper: 'text-gray-500'
    },
    focus: {
      container: 'border-primary-500 ring-4 ring-primary-100',
      label: 'text-primary-600',
      input: 'text-gray-900 placeholder:text-gray-400',
      helper: 'text-gray-500'
    },
    error: {
      container: 'border-red-500 bg-red-50',
      label: 'text-red-700',
      input: 'text-red-900 placeholder:text-red-400',
      helper: 'text-red-600'
    },
    success: {
      container: 'border-green-500 bg-green-50',
      label: 'text-green-700',
      input: 'text-green-900 placeholder:text-green-400',
      helper: 'text-green-600'
    }
  };

  const styles = stateStyles[state];

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className={`block text-sm font-semibold transition-colors ${styles.label}`}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && !isLoading && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Input Field */}
        <input
          {...props}
          type={showPasswordToggle && showPassword ? 'text' : props.type}
          disabled={isLoading || props.disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full rounded-xl border-2 px-4 py-3
            transition-all duration-200
            focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed
            ${Icon || isLoading ? 'pl-11' : ''}
            ${showPasswordToggle ? 'pr-11' : 'pr-4'}
            ${styles.container}
            ${styles.input}
            ${className}
          `}
        />

        {/* Password Toggle */}
        {showPasswordToggle && !isLoading && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}

        {/* Success Icon */}
        {success && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <CheckCircle className="h-5 w-5" />
          </div>
        )}

        {/* Error Icon */}
        {error && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <AlertCircle className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Helper/Error Text */}
      {(helperText || error || success) && (
        <div className="flex items-start gap-2">
          {(error || success) && (
            <div className="flex-shrink-0 mt-0.5">
              {error && <AlertCircle className="h-4 w-4 text-red-500" />}
              {success && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
          )}
          <p className={`text-sm leading-relaxed ${styles.helper}`}>
            {error || success || helperText}
          </p>
        </div>
      )}
    </div>
  );
};

// Pre-configured variants for common input types
export const InputVariants = {
  Email: (props) => (
    <InputEnhanced
      type="email"
      label="Email Address"
      placeholder="Enter your email"
      icon={Mail}
      {...props}
    />
  ),

  Password: (props) => (
    <InputEnhanced
      type="password"
      label="Password"
      placeholder="Enter your password"
      showPasswordToggle
      icon={Lock}
      {...props}
    />
  ),

  Phone: (props) => (
    <InputEnhanced
      type="tel"
      label="Phone Number"
      placeholder="Enter your phone number"
      icon={Phone}
      {...props}
    />
  ),

  Search: (props) => (
    <InputEnhanced
      type="search"
      placeholder="Search doctors, specialties..."
      icon={Search}
      {...props}
    />
  )
};

// Usage examples for documentation
export const InputExamples = () => (
  <div className="space-y-6 p-6 max-w-md">
    <h3 className="text-lg font-semibold mb-4">InputEnhanced Examples</h3>

    {/* Default State */}
    <div>
      <h4 className="font-medium mb-2">Default State</h4>
      <InputEnhanced
        label="Full Name"
        placeholder="Enter your full name"
        helperText="This will be displayed on your profile"
      />
    </div>

    {/* Focus State */}
    <div>
      <h4 className="font-medium mb-2">Focus State (Click to see)</h4>
      <InputEnhanced
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        icon={Mail}
      />
    </div>

    {/* Error State */}
    <div>
      <h4 className="font-medium mb-2">Error State</h4>
      <InputEnhanced
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        error="Please enter a valid email address"
        icon={Mail}
      />
    </div>

    {/* Success State */}
    <div>
      <h4 className="font-medium mb-2">Success State</h4>
      <InputEnhanced
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        success="Email address is available"
        icon={Mail}
      />
    </div>

    {/* Password with Toggle */}
    <div>
      <h4 className="font-medium mb-2">Password with Toggle</h4>
      <InputEnhanced
        label="Password"
        type="password"
        placeholder="Enter your password"
        showPasswordToggle
        icon={Lock}
        helperText="Must be at least 8 characters"
      />
    </div>

    {/* Loading State */}
    <div>
      <h4 className="font-medium mb-2">Loading State</h4>
      <InputEnhanced
        label="Verifying..."
        placeholder="Checking availability..."
        isLoading
        icon={Loader}
      />
    </div>
  </div>
);

export default InputEnhanced;
