import { useState, useCallback } from "react";
import { toast } from "../hooks/use-toast";

export interface DiaryEntry {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  privacy: "private" | "shared";
  created_at: string;
  updated_at: string;
}

export const useDiaryEntries = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);

  const createEntry = async () => {
    try {
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        user_id: "",
        title: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        content: "",
        privacy: "private",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setEntries((prev) => [newEntry, ...prev]);
      setCurrentEntry(newEntry);
      return newEntry;
    } catch (error) {
      console.error("Error creating entry:", error);
      toast({
        title: "Error",
        description: "Failed to create new entry",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateEntry = async (
    id: string,
    updates: Partial<Pick<DiaryEntry, "title" | "content" | "privacy">>
  ) => {
    try {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id 
            ? { ...entry, ...updates, updated_at: new Date().toISOString() } 
            : entry
        )
      );

      if (currentEntry?.id === id) {
        setCurrentEntry((prev) => 
          prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null
        );
      }
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      if (currentEntry?.id === id) {
        setCurrentEntry(null);
      }

      toast({
        title: "Entry deleted",
        description: "Your diary entry has been removed",
      });
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    }
  };

  const refetch = useCallback(() => {
    // Local state only - no database sync needed
    setLoading(false);
  }, []);

  return {
    entries,
    loading,
    currentEntry,
    setCurrentEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch,
  };
};
