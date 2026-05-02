'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useToastHelpers } from './use-toast';

// Generic hook for fetching and subscribing to data with real-time updates
export function useAdminData<T extends { id: string }>(
  tableName: string,
  queryFn: () => Promise<{ data: T[] | null; error: Error | null }>,
  options?: {
    filter?: string;
    enabled?: boolean;
    onError?: (error: Error) => void;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToastHelpers();

  const fetchData = useCallback(async () => {
    if (options?.enabled === false) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: fetchError } = await queryFn();
      if (fetchError) {
        throw fetchError;
      }
      setData(result || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      showError(`Failed to load ${tableName}: ${errorMessage}`);
      options?.onError?.(err as Error);
    } finally {
      setLoading(false);
    }
  }, [queryFn, tableName, options?.enabled, options?.onError]);

  useEffect(() => {
    fetchData();

    if (options?.enabled === false) return;

    // Subscribe to real-time changes
    const channel = supabaseBrowser
      .channel(`admin-${tableName}`)
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: tableName,
          ...(options?.filter && { filter: options.filter })
        },
        (payload: { eventType: string; new: T; old: { id: string } }) => {
          console.log(`[Realtime] ${tableName} ${payload.eventType}:`, payload);
          
          if (payload.eventType === 'INSERT') {
            setData((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [tableName, options?.filter, options?.enabled, fetchData]);

  return { data, loading, error, refetch: fetchData, setData };
}

// Hook for paginated data with search
export function usePaginatedData<T extends { id: string }>(
  tableName: string,
  fetchFn: (page: number, limit: number, search: string) => Promise<{ data: T[]; total: number }>,
  options?: { initialPage?: number; initialLimit?: number; initialSearch?: string }
) {
  const [page, setPage] = useState(options?.initialPage || 1);
  const [limit, setLimit] = useState(options?.initialLimit || 10);
  const [search, setSearch] = useState(options?.initialSearch || '');
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { error: showError } = useToastHelpers();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(page, limit, search);
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      showError(`Failed to load ${tableName}: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, limit, search, tableName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Subscribe to real-time changes
    const channel = supabaseBrowser
      .channel(`admin-${tableName}-paginated`)
      .on(
        'postgres_changes' as any,
        { event: '*', schema: 'public', table: tableName },
        () => {
          // Refetch when data changes
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [tableName, fetchData]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    search,
    loading,
    error,
    totalPages,
    setPage,
    setLimit,
    setSearch,
    refetch: fetchData
  };
}

// Hook for mutations with optimistic updates
export function useAdminMutation<T>(
  tableName: string,
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
) {
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useToastHelpers();

  const mutate = useCallback(async (
    operation: () => Promise<T>,
    { successMessage, errorMessage }: { successMessage?: string; errorMessage?: string } = {}
  ) => {
    setLoading(true);
    try {
      const result = await operation();
      if (successMessage) success(successMessage);
      options?.onSuccess?.();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      showError(errorMessage || message);
      options?.onError?.(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  return { mutate, loading };
}
