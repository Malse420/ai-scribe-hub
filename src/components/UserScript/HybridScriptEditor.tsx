import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LocalStorageManager } from '@/utils/localStorageManager';

interface UserScript {
  id: string;
  title: string;
  content: string;
  version: number;
  is_shared: boolean;
  shared_with: string[];
}

export const HybridScriptEditor = () => {
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [localScript, setLocalScript] = useState<UserScript | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { data: cloudScripts } = useQuery({
    queryKey: ['userscripts'],
    queryFn: async () => {
      if (!isOnline) return [];
      const { data, error } = await supabase
        .from('userscripts')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isOnline,
  });

  const saveScript = useMutation({
    mutationFn: async (script: Partial<UserScript>) => {
      if (!isOnline) {
        LocalStorageManager.setEncrypted('local_script', script);
        return script;
      }

      const { data, error } = await supabase
        .from('userscripts')
        .upsert([script])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userscripts'] });
      toast.success('Script saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save script');
      console.error(error);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Script Editor ({isOnline ? 'Online' : 'Offline'})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add your editor UI components here */}
        <div className="space-y-4">
          {/* Editor implementation */}
        </div>
      </CardContent>
    </Card>
  );
};
