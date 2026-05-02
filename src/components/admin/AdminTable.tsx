'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { adminClasses } from '@/lib/admin-design-system';

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (item: T) => ReactNode;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
  className?: string;
}

export function AdminTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyState,
  className = ''
}: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className={`${adminClasses.card} ${className}`}>
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              {columns.map((_, j) => (
                <div key={j} className="h-12 bg-gray-100 dark:bg-gray-800 rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`${adminClasses.card} ${className}`}>
        {emptyState || (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${adminClasses.card} overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className={adminClasses.table.table}>
          <thead className={adminClasses.table.thead}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={adminClasses.table.th}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={adminClasses.table.tbody}>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={`${adminClasses.table.tr} ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((column) => (
                  <td key={`${keyExtractor(item)}-${column.key}`} className={adminClasses.table.td}>
                    {column.render 
                      ? column.render(item)
                      : (item as Record<string, unknown>)[column.key] as ReactNode
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
