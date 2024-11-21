import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface RegionalSettings {
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
}

interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  regional_settings: RegionalSettings;
}

export const usePreferences = () => {
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["preferences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .single();

      if (error) throw error;
      return data as UserPreferences;
    },
  });

  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: Partial<UserPreferences>) => {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({ ...preferences, ...newPreferences });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
      toast.success("Preferences updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update preferences");
      console.error(error);
    },
  });

  return {
    preferences,
    isLoading,
    updatePreferences,
  };
};