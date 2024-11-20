import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface DebugLog {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  workflow_id?: string;
  userscript_id?: string;
  created_at: string;
}

interface LogQueryParams {
  severity?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const useDebugLogs = () => {
  const queryClient = useQueryClient();

  const getLogs = async ({ severity, startDate, endDate, page = 1, pageSize = 10 }: LogQueryParams) => {
    let query = supabase
      .from('debug_logs')
      .select('*', { count: 'exact' });

    if (severity) {
      query = query.eq('severity', severity);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;

    return { logs: data, total: count };
  };

  const { data, isLoading } = useQuery({
    queryKey: ['debug-logs'],
    queryFn: () => getLogs({}),
  });

  const addLog = useMutation({
    mutationFn: async (log: Omit<DebugLog, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('debug_logs')
        .insert([log])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debug-logs'] });
      toast.success('Log added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add log');
      console.error(error);
    },
  });

  return {
    logs: data?.logs || [],
    total: data?.total || 0,
    isLoading,
    addLog,
    getLogs,
  };
};