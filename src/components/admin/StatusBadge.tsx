'use client';

import { statusColors } from '@/lib/admin-design-system';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase() || 'default';
  const badgeClass = statusColors[normalizedStatus] || statusColors.default;
  
  return (
    <span className={`${badgeClass} ${className}`}>
      {status}
    </span>
  );
}
