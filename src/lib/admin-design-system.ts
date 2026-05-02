// Admin Design System - Consistent styling for all admin pages
export const adminColors = {
  primary: {
    DEFAULT: '#8B5CF6',
    light: '#A78BFA',
    dark: '#7C3AED',
    50: '#F5F3FF',
    100: '#EDE9FE',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
  },
  success: {
    DEFAULT: '#10B981',
    light: '#34D399',
    dark: '#059669',
    50: '#ECFDF5',
    100: '#D1FAE5',
  },
  warning: {
    DEFAULT: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    50: '#FFFBEB',
    100: '#FEF3C7',
  },
  error: {
    DEFAULT: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    50: '#FEF2F2',
    100: '#FEE2E2',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export const adminSpacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
};

export const adminTypography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    arabic: ['Noto Sans Arabic', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  },
};

export const adminShadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const adminTransitions = {
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};

// Tailwind classes for common patterns
export const adminClasses = {
  card: 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm',
  cardHeader: 'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
  cardBody: 'p-6',
  cardFooter: 'px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl',
  
  button: {
    primary: 'px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
    secondary: 'px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors',
    danger: 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors',
    ghost: 'px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors',
  },
  
  input: 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors',
  select: 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors',
  
  table: {
    container: 'overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700',
    table: 'w-full text-left border-collapse',
    thead: 'bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700',
    th: 'px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider',
    tbody: 'divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800',
    td: 'px-6 py-4 text-sm text-gray-900 dark:text-gray-100',
    tr: 'hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
  },
  
  badge: {
    default: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    primary: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  },
  
  modal: {
    overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4',
    container: 'bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden',
    header: 'px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between',
    body: 'px-6 py-4 overflow-y-auto',
    footer: 'px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3',
  },
};

// Status colors mapping
export const statusColors: Record<string, string> = {
  active: adminClasses.badge.success,
  pending: adminClasses.badge.warning,
  inactive: adminClasses.badge.default,
  suspended: adminClasses.badge.error,
  rejected: adminClasses.badge.error,
  approved: adminClasses.badge.success,
  completed: adminClasses.badge.success,
  draft: adminClasses.badge.default,
  published: adminClasses.badge.success,
  archived: adminClasses.badge.default,
};

// Responsive breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
};
