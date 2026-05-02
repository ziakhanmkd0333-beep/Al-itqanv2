'use client';

import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { adminClasses } from '@/lib/admin-design-system';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({ 
  placeholder = 'Search...', 
  value, 
  onChange, 
  onSearch,
  className = '',
  debounceMs = 300
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
      onSearch?.(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, onSearch]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className={`${adminClasses.input} pl-10 pr-10`}
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            onChange('');
            onSearch?.('');
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
