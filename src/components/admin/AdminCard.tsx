'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { adminClasses } from '@/lib/admin-design-system';

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
  footer?: ReactNode;
  noPadding?: boolean;
}

export function AdminCard({ 
  children, 
  className = '', 
  title, 
  action,
  footer,
  noPadding = false 
}: AdminCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${adminClasses.card} ${className}`}
    >
      {(title || action) && (
        <div className={adminClasses.cardHeader}>
          <div className="flex items-center justify-between">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            {action && <div>{action}</div>}
          </div>
        </div>
      )}
      <div className={noPadding ? '' : adminClasses.cardBody}>
        {children}
      </div>
      {footer && (
        <div className={adminClasses.cardFooter}>
          {footer}
        </div>
      )}
    </motion.div>
  );
}
