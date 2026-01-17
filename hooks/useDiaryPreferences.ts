import { useState, useCallback } from "react";
import { toast } from "../hooks/use-toast";

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
  sound_enabled: false,
};

export const useDiaryPreferences = () => {
  const [preferences, setPreferences] = useState<DiaryPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(false);

  const updatePreferences = useCallback(async (newPrefs: Partial<DiaryPreferences>) => {
    try {
      const updated = { ...preferences, ...newPrefs };
      setPreferences(updated);
      
      // Store in localStorage for persistence
      localStorage.setItem('diaryPreferences', JSON.stringify(updated));
      
      toast({
        title: "Preferences saved",
        description: "Your diary preferences have been updated",
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      });
    }
  }, [preferences]);

  return { preferences, loading, updatePreferences };
};
