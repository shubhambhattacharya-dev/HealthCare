import React from 'react';
import Button from './button.jsx';

/**
 * EmptyState Component - Professional empty state designs
 *
 * Features:
 * - 5 variants: default, error, success, warning, info
 * - Customizable icons, titles, descriptions
 * - Optional action buttons
 * - Consistent styling with design system
 *
 * @param {React.Component} icon - Lucide icon component
 * @param {string} title - Main heading
 * @param {string} description - Supporting text
 * @param {React.Component} action - Action button or element
 * @param {string} variant - Visual style variant
 * @param {string} className - Additional CSS classes
 */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className = ''
}) => {
  // Color variants for different states
  const variants = {
    default: {
      icon: 'text-gray-400',
      title: 'text-gray-900',
      description: 'text-gray-600'
    },
    error: {
      icon: 'text-red-400',
      title: 'text-red-900',
      description: 'text-red-600'
    },
    success: {
      icon: 'text-green-400',
      title: 'text-green-900',
      description: 'text-green-600'
    },
    warning: {
      icon: 'text-yellow-400',
      title: 'text-yellow-900',
      description: 'text-yellow-600'
    },
    info: {
      icon: 'text-blue-400',
      title: 'text-blue-900',
      description: 'text-blue-600'
    }
  };

  const colors = variants[variant] || variants.default;

  return (
    <div className={`text-center py-16 ${className}`}>
      {/* Icon */}
      {Icon && (
        <div className={`h-24 w-24 ${colors.icon} rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-50`}>
          <Icon className="h-12 w-12" />
        </div>
      )}

      {/* Title */}
      <h3 className={`text-xl font-semibold ${colors.title} mb-2`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={`${colors.description} max-w-md mx-auto mb-6 leading-relaxed`}>
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

// Pre-configured variants for common use cases
export const EmptyStates = {
  // No doctors available
  NoDoctors: ({ onBrowseAll }) => (
    <EmptyState
      icon="Users"
      title="No doctors available right now"
      description="Try adjusting your filters or check back later for more healthcare professionals."
      action={
        <Button onClick={onBrowseAll}>
          Browse All Doctors
        </Button>
      }
    />
  ),

  // No appointments
  NoAppointments: ({ onBookNow }) => (
    <EmptyState
      icon="Calendar"
      title="No appointments scheduled"
      description="Book your first appointment to get started with personalized healthcare."
      action={
        <Button onClick={onBookNow}>
          Book Appointment
        </Button>
      }
    />
  ),

  // Search no results
  NoSearchResults: ({ onClearFilters, searchTerm }) => (
    <EmptyState
      icon="Search"
      title="No results found"
      description={`We couldn't find any matches for "${searchTerm}". Try different keywords or clear your filters.`}
      action={
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      }
    />
  ),

  // Error state
  Error: ({ onRetry }) => (
    <EmptyState
      variant="error"
      icon="AlertCircle"
      title="Something went wrong"
      description="We're having trouble loading this content. Please try again."
      action={
        <Button onClick={onRetry}>
          Try Again
        </Button>
      }
    />
  ),

  // Loading state (different from empty)
  Loading: ({ message = "Loading..." }) => (
    <div className="text-center py-16">
      <div className="h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
      <p className="text-gray-600">{message}</p>
    </div>
  )
};

export default EmptyState;
