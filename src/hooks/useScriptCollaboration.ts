import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Collaborator {
  id: string;
  email?: string;
  online?: boolean;
  lastActive?: string;
}

export const useScriptCollaboration = (scriptId: string) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`script:${scriptId}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const activeCollaborators = Object.values(newState).flat().map((presence: any) => ({
          id: presence.user_id,
          email: presence.email,
          online: true,
          lastActive: new Date().toISOString(),
        }));
        setCollaborators(activeCollaborators);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            email: (await supabase.auth.getUser()).data.user?.email,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [scriptId]);

  const addCollaborator = useMutation({
    mutationFn: async (email: string) => {
      const { data: scriptData, error: scriptError } = await supabase
        .from('userscripts')
        .select('collaborators')
        .eq('id', scriptId)
        .single();

      if (scriptError) throw scriptError;

      const currentCollaborators = (scriptData?.collaborators as string[]) || [];
      
      // Get user by email using auth API
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1,
        filters: {
          email: email
        }
      });

      if (userError || !userData?.users?.[0]) {
        throw new Error('User not found');
      }

      const userId = userData.users[0].id;

      const { error } = await supabase
        .from('userscripts')
        .update({
          collaborators: [...currentCollaborators, userId]
        })
        .eq('id', scriptId);

      if (error) throw error;
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['script', scriptId] });
      toast.success('Collaborator added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add collaborator: ' + error.message);
    },
  });

  const removeCollaborator = useMutation({
    mutationFn: async (userId: string) => {
      const { data: scriptData, error: scriptError } = await supabase
        .from('userscripts')
        .select('collaborators')
        .eq('id', scriptId)
        .single();

      if (scriptError) throw scriptError;

      const currentCollaborators = (scriptData?.collaborators as string[]) || [];
      const updatedCollaborators = currentCollaborators.filter(id => id !== userId);

      const { error } = await supabase
        .from('userscripts')
        .update({
          collaborators: updatedCollaborators
        })
        .eq('id', scriptId);

      if (error) throw error;
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['script', scriptId] });
      toast.success('Collaborator removed successfully');
    },
    onError: (error) => {
      toast.error('Failed to remove collaborator: ' + error.message);
    },
  });

  return {
    collaborators,
    addCollaborator,
    removeCollaborator,
  };
};