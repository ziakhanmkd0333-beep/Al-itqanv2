'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
  className = ''
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 ${className}`}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link
            href="/dashboard/admin/"
            className="flex items-center gap-1 hover:text-violet-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-violet-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-gray-100">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {action && <div>{action}</div>}
      </div>
    </motion.div>
  );
}
