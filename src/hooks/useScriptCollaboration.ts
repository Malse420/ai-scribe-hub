import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Collaborator } from "@/types/script";

export const useScriptCollaboration = (scriptId: string) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`script:${scriptId}`)
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();
        const activeCollaborators = Object.values(newState)
          .flat()
          .map((presence: any) => ({
            id: presence.user_id,
            email: presence.email || "Unknown",
            online: true,
            lastActive: new Date().toISOString(),
          }));
        setCollaborators(activeCollaborators);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await channel.track({
              user_id: user.id,
              email: user.email,
            });
          }
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [scriptId]);

  const addCollaborator = useMutation({
    mutationFn: async (email: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: scriptData, error: scriptError } = await supabase
        .from("userscripts")
        .select("collaborators, active_collaborators")
        .eq("id", scriptId)
        .single();

      if (scriptError) throw scriptError;

      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (userError) throw new Error("User not found");

      const collaborators = scriptData?.collaborators || [];
      const activeCollaborators = scriptData?.active_collaborators || [];

      const { error } = await supabase
        .from("userscripts")
        .update({
          collaborators: [...collaborators, userData.id],
          active_collaborators: [...activeCollaborators, userData.id],
        })
        .eq("id", scriptId);

      if (error) throw error;
      return userData.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["script", scriptId] });
      toast.success("Collaborator added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add collaborator: " + error.message);
    },
  });

  const removeCollaborator = useMutation({
    mutationFn: async (userId: string) => {
      const { data: scriptData, error: scriptError } = await supabase
        .from("userscripts")
        .select("collaborators, active_collaborators")
        .eq("id", scriptId)
        .single();

      if (scriptError) throw scriptError;

      const collaborators = (scriptData?.collaborators || []).filter(
        (id) => id !== userId
      );
      const activeCollaborators = (scriptData?.active_collaborators || []).filter(
        (id) => id !== userId
      );

      const { error } = await supabase
        .from("userscripts")
        .update({
          collaborators,
          active_collaborators: activeCollaborators,
        })
        .eq("id", scriptId);

      if (error) throw error;
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["script", scriptId] });
      toast.success("Collaborator removed successfully");
    },
    onError: (error) => {
      toast.error("Failed to remove collaborator: " + error.message);
    },
  });

  return {
    collaborators,
    addCollaborator,
    removeCollaborator,
  };
};