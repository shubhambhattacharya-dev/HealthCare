import React from 'react';

/**
 * CardVariants Component - Standardized card system with 3 patterns
 *
 * Solves inconsistent card usage across the application.
 * Provides compound component API for flexible card composition.
 *
 * Features:
 * - 3 card variants: Vertical, Horizontal, Compact
 * - Consistent elevation and hover effects
 * - Compound component pattern
 * - Flexible content slots
 *
 * @component
 */
const Card = {
  /**
   * Vertical Card - For doctors, products, features
   * Image on top, content below
   */
  Vertical: ({
    image,
    title,
    subtitle,
    children,
    className = '',
    onClick,
    animate = true
  }) => (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-gray-200 shadow-card
        hover:shadow-card-hover hover:-translate-y-1
        transition-all duration-300 overflow-hidden
        cursor-pointer group ${className}
      `}
    >
      {/* Image Section */}
      {image && (
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-300">
            {image}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Custom content slot */}
        {children && (
          <div className="space-y-3">
            {children}
          </div>
        )}
      </div>
    </div>
  ),

  /**
   * Horizontal Card - For appointments, messages, listings
   * Image on left, content on right
   */
  Horizontal: ({
    image,
    title,
    subtitle,
    children,
    className = '',
    onClick,
    animate = true
  }) => (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-gray-200 shadow-card
        hover:shadow-card-hover hover:-translate-y-1
        transition-all duration-300 overflow-hidden
        cursor-pointer group ${className}
      `}
    >
      <div className="flex items-center gap-4 p-6">
        {/* Image Section */}
        {image && (
          <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-50 group-hover:scale-105 transition-transform duration-300">
            {image}
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 truncate">{subtitle}</p>
          )}

          {/* Custom content slot */}
          {children && (
            <div className="space-y-2">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  ),

  /**
   * Compact Card - For stats, quick actions, summaries
   * Minimal layout with key information
   */
  Compact: ({
    title,
    meta,
    children,
    className = '',
    onClick,
    animate = true
  }) => (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-gray-200 shadow-card
        hover:shadow-card-hover hover:-translate-y-1
        transition-all duration-300
        cursor-pointer group p-4 ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
            {title}
          </h3>
          {meta && (
            <p className="text-sm text-gray-500 mt-1 truncate">{meta}</p>
          )}
        </div>

        {/* Action content slot */}
        {children && (
          <div className="flex-shrink-0 ml-4">
            {children}
          </div>
        )}
      </div>
    </div>
  )
};

// Compound component pattern - additional slots for complex cards
Card.Image = ({ src, alt, className = '', ...props }) => (
  <img
    src={src}
    alt={alt}
    className={`w-full h-full object-cover ${className}`}
    {...props}
  />
);

Card.Content = ({ children, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {children}
  </div>
);

Card.Actions = ({ children, className = '' }) => (
  <div className={`flex items-center gap-3 pt-2 ${className}`}>
    {children}
  </div>
);

Card.Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

Card.Stats = ({ value, label, className = '' }) => (
  <div className={`text-center ${className}`}>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

// Usage examples for documentation
export const CardExamples = () => (
  <div className="space-y-8 p-6">
    <h3 className="text-lg font-semibold mb-4">Card Variants Examples</h3>

    {/* Vertical Card Example */}
    <div className="max-w-sm">
      <h4 className="font-medium mb-3">Vertical Card (Doctors)</h4>
      <Card.Vertical
        image={<Card.Image src="/api/placeholder/400/300" alt="Doctor" />}
        title="Dr. Sarah Johnson"
        subtitle="Cardiologist"
      >
        <Card.Content>
          <p className="text-sm text-gray-600">15 years experience</p>
          <Card.Badge variant="success">Available</Card.Badge>
        </Card.Content>
        <Card.Actions>
          <button className="text-primary-600 text-sm font-medium">Book Now →</button>
        </Card.Actions>
      </Card.Vertical>
    </div>

    {/* Horizontal Card Example */}
    <div className="max-w-md">
      <h4 className="font-medium mb-3">Horizontal Card (Appointments)</h4>
      <Card.Horizontal
        image={<Card.Image src="/api/placeholder/64/64" alt="Appointment" />}
        title="Dr. Sarah Johnson"
        subtitle="Cardiology Consultation"
      >
        <p className="text-sm text-gray-500">Tomorrow, 2:00 PM</p>
        <Card.Badge variant="primary">Confirmed</Card.Badge>
      </Card.Horizontal>
    </div>

    {/* Compact Card Example */}
    <div className="max-w-sm">
      <h4 className="font-medium mb-3">Compact Card (Stats)</h4>
      <Card.Compact
        title="Total Patients"
        meta="This month"
      >
        <span className="text-2xl font-bold text-primary-600">1,247</span>
      </Card.Compact>
    </div>
  </div>
);

export default Card;
