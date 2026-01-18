import { useState, useCallback, useEffect } from "react";
import { toast } from "../hooks/use-toast";
import { 
  createDiaryEntry, 
  getUserDiaryEntries, 
  updateDiaryEntry as updateDiaryEntryAction, 
  deleteDiaryEntry as deleteDiaryEntryAction 
} from "../lib/actions/diary.actions";
import FetchUser from "../src/app/components/FetchUser";

export interface DiaryEntry {
  id: string;
  userId: string;
  title: string | null;
  content: string;
  privacy: "private" | "shared";
  created_at: string;
  updated_at: string;
}

export const useDiaryEntries = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const mapDocumentToEntry = (doc: any): DiaryEntry => ({
    id: doc.$id,
    userId: doc.userId,
    title: doc.title,
    content: doc.content,
    privacy: doc.privacy,
    created_at: doc.$createdAt || doc.entry_date, // Fallback if needed
    updated_at: doc.$updatedAt,
  });

  // Fetch Session User
  useEffect(() => {
    const init = async () => {
      try {
        const user = await FetchUser();
        if (user) {
          setUserId(user.$id);
          fetchEntries(user.$id);
        } else {
           setLoading(false);
        }
      } catch (error) {
        console.error("No user logged in or error fetching user:", error);
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchEntries = async (uid: string) => {
    setLoading(true);
    try {
      const docs = await getUserDiaryEntries(uid);
      const mapped = docs.map(mapDocumentToEntry);
      setEntries(mapped);
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast({
        title: "Error",
        description: "Failed to load diary entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async () => {
    if (!userId) {
      toast({ title: "Error", description: "You must be logged in to create an entry", variant: "destructive" });
      return null;
    }

    try {
      const now = new Date();
      const defaultTitle = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const newDoc = await createDiaryEntry({
        userId,
        title: defaultTitle,
        content: "",
        privacy: "private",
        entry_date: now,
      });

      const newEntry = mapDocumentToEntry(newDoc);
      
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
      // Optimistic update
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

      // Server update
      // We explicitly convert nulls to undefined to satisfy the stricter Appwrite type signature
      const sanitizedUpdates = {
        title: updates.title ?? undefined,
        content: updates.content ?? undefined,
        privacy: updates.privacy ?? undefined,
      };

      await updateDiaryEntryAction(id, sanitizedUpdates);
    } catch (error) {
      console.error("Error updating entry:", error);
      toast({ title: "Save failed", description: "Changes might not be saved", variant: "destructive" });
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      // Optimistic delete
      const previousEntries = [...entries];
      const entryToDelete = entries.find(e => e.id === id);

      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      if (currentEntry?.id === id) {
        setCurrentEntry(null);
      }

      await deleteDiaryEntryAction(id);

      toast({
        title: "Entry deleted",
        description: "Your diary entry has been removed",
      });
    } catch (error) {
      console.error("Error deleting entry:", error);
      // Revert optimization on error? ideally yes, but keeping it simple for now
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    }
  };

  const refetch = useCallback(() => {
    if (userId) fetchEntries(userId);
  }, [userId]);

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
