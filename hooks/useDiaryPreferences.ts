import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface DiaryPreferences {
  background_color: string;
  paper_color: string;
  ink_color: string;
  font_family: string;
  sound_enabled: boolean;
}

const defaultPreferences: DiaryPreferences = {
  background_color: "#faf8f5",
  paper_color: "#fffef9",
  ink_color: "#2d2d2d",
  font_family: "handwriting",
  sound_enabled: true,
};

export const useDiaryPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<DiaryPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setPreferences(defaultPreferences);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("diary_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences({
          background_color: data.background_color,
          paper_color: data.paper_color,
          ink_color: data.ink_color,
          font_family: data.font_family,
          sound_enabled: data.sound_enabled,
        });
      } else {
        // Create default preferences for new user
        const { error: insertError } = await supabase
          .from("diary_preferences")
          .insert({
            user_id: user.id,
            ...defaultPreferences,
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreferences = async (newPrefs: Partial<DiaryPreferences>) => {
    if (!user) return;

    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);

    try {
      const { error } = await supabase
        .from("diary_preferences")
        .update(updated)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      });
    }
  };

  return { preferences, loading, updatePreferences };
};
