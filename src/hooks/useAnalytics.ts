import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface AnalyticsEvent {
  event_type: string;
  event_data: Record<string, any>;
}

const SESSION_ID = uuidv4();
const DEVICE_ID = localStorage.getItem('device_id') || uuidv4();

if (!localStorage.getItem('device_id')) {
  localStorage.setItem('device_id', DEVICE_ID);
}

export const useAnalytics = () => {
  const trackEvent = useMutation({
    mutationFn: async ({ event_type, event_data }: AnalyticsEvent) => {
      const { data, error } = await supabase
        .from('analytics')
        .insert([
          {
            event_type,
            event_data,
            session_id: SESSION_ID,
            device_id: DEVICE_ID,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });

  const getMetrics = async (startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) throw error;
    return data;
  };

  return {
    trackEvent,
    getMetrics,
  };
};