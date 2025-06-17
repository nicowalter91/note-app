// Design System Components für einheitliches Styling
import React from 'react';
import { FaSpinner } from 'react-icons/fa';

// Einheitliche Farben und Styles
export const designTokens = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe', 
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#10b981',
      600: '#059669'
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706'
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626'
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  }
};

// Einheitlicher Page Header
export const PageHeader = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  action,
  children 
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="text-3xl text-blue-600" />}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
    {children && <div className="mt-4">{children}</div>}
  </div>
);

// Einheitliche Card-Komponente
export const Card = ({ 
  title, 
  icon: Icon, 
  children, 
  className = '', 
  headerAction,
  size = 'default' // 'sm', 'default', 'lg'
}) => {
  const sizeClasses = {
    sm: 'p-4',
    default: 'p-6', 
    lg: 'p-8'
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${sizeClasses[size]} ${className}`}>
      {(title || Icon || headerAction) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="text-xl text-blue-600" />}
            {title && <h2 className="text-xl font-bold text-gray-800">{title}</h2>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

// Einheitliche Button-Komponente
export const Button = ({ 
  children, 
  variant = 'primary', // 'primary', 'secondary', 'success', 'warning', 'danger'
  size = 'default', // 'sm', 'default', 'lg'
  icon: Icon,
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <FaSpinner className="animate-spin mr-2" />
      ) : (
        Icon && <Icon className="mr-2" />
      )}
      {children}
    </button>
  );
};

// Einheitliche Badge-Komponente
export const Badge = ({ 
  children, 
  variant = 'default', // 'default', 'success', 'warning', 'danger', 'info'
  size = 'default' // 'sm', 'default', 'lg'
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800', 
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    default: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
};

// Einheitlicher Priority Badge
export const PriorityBadge = ({ priority }) => {
  const variants = {
    high: 'danger',
    medium: 'warning', 
    low: 'success'
  };
  
  const labels = {
    high: 'Hoch',
    medium: 'Mittel',
    low: 'Niedrig'
  };

  return <Badge variant={variants[priority]}>{labels[priority]}</Badge>;
};

// Einheitlicher Status Badge
export const StatusBadge = ({ status, icon: Icon }) => {
  const variants = {
    completed: 'success',
    'in-progress': 'info',
    pending: 'warning',
    cancelled: 'danger'
  };
  
  const labels = {
    completed: 'Abgeschlossen',
    'in-progress': 'In Bearbeitung', 
    pending: 'Ausstehend',
    cancelled: 'Abgebrochen'
  };

  return (
    <Badge variant={variants[status]}>
      {Icon && <Icon className="mr-1" />}
      {labels[status] || status}
    </Badge>
  );
};

// Einheitliche Loading-Komponente
export const LoadingSpinner = ({ size = 'default', text = 'Lädt...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <FaSpinner className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
};

// Einheitliche Empty State Komponente
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) => (
  <div className="text-center py-12">
    {Icon && <Icon className="mx-auto text-6xl text-gray-300 mb-4" />}
    <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
    {description && <p className="text-gray-600 mb-4">{description}</p>}
    {action && <div>{action}</div>}
  </div>
);

// Einheitliche Section-Komponente für Listen
export const ListSection = ({ 
  title, 
  icon: Icon, 
  children, 
  action,
  emptyState 
}) => (
  <Card 
    title={title} 
    icon={Icon}
    headerAction={action}
  >
    {children ? children : emptyState}
  </Card>
);

// Einheitlicher List Item
export const ListItem = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  badge, 
  action, 
  onClick,
  className = '' 
}) => (
  <div 
    className={`flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${className}`}
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      {Icon && (
        <div className="p-2 rounded bg-gray-100">
          <Icon className="text-gray-600" />
        </div>
      )}
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
    </div>
    
    <div className="flex items-center space-x-2">
      {badge && <div>{badge}</div>}
      {action && <div>{action}</div>}
    </div>
  </div>
);

// Quick Actions Grid
export const QuickActionsGrid = ({ actions }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {actions.map((action, index) => (
      <button
        key={index}
        onClick={action.onClick}
        className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow text-left"
      >
        <div className="flex items-center space-x-3">
          {action.icon && <action.icon className="text-2xl text-blue-600" />}
          <div>
            <h3 className="font-semibold text-gray-800">{action.title}</h3>
            {action.description && (
              <p className="text-sm text-gray-600">{action.description}</p>
            )}
          </div>
        </div>
      </button>
    ))}
  </div>
);

// Stats Grid
export const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map((stat, index) => (
      <Card key={index} size="sm" className="text-center">
        {stat.icon && <stat.icon className="mx-auto text-3xl text-blue-600 mb-2" />}
        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
        <div className="text-sm text-gray-600">{stat.label}</div>
        {stat.change && (
          <div className={`text-xs mt-1 ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stat.change > 0 ? '+' : ''}{stat.change}%
          </div>
        )}
      </Card>
    ))}
  </div>
);

// Error Boundary Fallback
export const ErrorFallback = ({ error, resetError }) => (
  <Card className="border-red-200 bg-red-50">
    <div className="text-center">
      <h2 className="text-lg font-semibold text-red-800 mb-2">
        Etwas ist schief gelaufen
      </h2>
      <p className="text-red-600 mb-4">
        {error?.message || 'Ein unerwarteter Fehler ist aufgetreten'}
      </p>
      <Button variant="danger" onClick={resetError}>
        Erneut versuchen
      </Button>
    </div>
  </Card>
);
