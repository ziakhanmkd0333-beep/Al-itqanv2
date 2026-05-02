'use client';

import { Edit2, Trash2, Eye, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  variant?: 'default' | 'approval' | 'compact';
  className?: string;
}

export function ActionButtons({
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  variant = 'default',
  className = ''
}: ActionButtonsProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const buttonClass = "p-2 rounded-lg transition-colors";
  
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`${buttonClass} hover:bg-gray-100 dark:hover:bg-gray-700`}
        >
          <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            {onView && (
              <button
                onClick={() => { onView(); setShowDropdown(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => { onEdit(); setShowDropdown(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => { onDelete(); setShowDropdown(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 last:rounded-b-lg"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'approval') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {onApprove && (
          <button
            onClick={onApprove}
            className={`${buttonClass} text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20`}
            title="Approve"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        )}
        {onReject && (
          <button
            onClick={onReject}
            className={`${buttonClass} text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20`}
            title="Reject"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {onView && (
        <button
          onClick={onView}
          className={`${buttonClass} text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20`}
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className={`${buttonClass} text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20`}
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className={`${buttonClass} text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20`}
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
