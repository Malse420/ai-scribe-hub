import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

export interface ApiKey {
  id: string;
  user_id: string;
  api_service: string;
  api_key: string;
  created_at: string;
  updated_at: string;
}

export const useApiKeys = () => {
  const queryClient = useQueryClient();

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('*');
      
      if (error) throw error;
      return data as ApiKey[];
    },
  });

  const addApiKey = useMutation({
    mutationFn: async (newKey: Omit<ApiKey, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('user_api_keys')
        .insert([newKey])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add API key');
      console.error(error);
    },
  });

  const updateApiKey = useMutation({
    mutationFn: async ({ id, ...key }: Partial<ApiKey> & { id: string }) => {
      const { data, error } = await supabase
        .from('user_api_keys')
        .update(key)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update API key');
      console.error(error);
    },
  });

  const deleteApiKey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete API key');
      console.error(error);
    },
  });

  return {
    apiKeys,
    isLoading,
    addApiKey,
    updateApiKey,
    deleteApiKey,
  };
};