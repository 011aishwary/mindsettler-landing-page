import { motion } from "framer-motion";
import { Plus, BookOpen, Lock, Users, Calendar } from "lucide-react";
import { Button } from "../ui/button1";
import { DiaryEntry } from "../../../../hooks/useDiaryEntries";

interface DiaryEntriesListProps {
  entries: DiaryEntry[];
  currentEntry: DiaryEntry | null;
  onSelectEntry: (entry: DiaryEntry) => void;
  onCreateEntry: () => void;
  paperColor: string;
  inkColor: string;
}

export const DiaryEntriesList = ({
  entries,
  currentEntry,
  onSelectEntry,
  onCreateEntry,
  paperColor,
  inkColor,
}: DiaryEntriesListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold text-foreground">
            My Entries
          </h2>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onCreateEntry}
            size="sm"
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </motion.div>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              Your diary is empty. Start your first entry!
            </p>
            <Button onClick={onCreateEntry} variant="outline" className="rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Create First Entry
            </Button>
          </motion.div>
        ) : (
          entries.map((entry, index) => (
            <motion.button
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectEntry(entry)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                currentEntry?.id === entry.id
                  ? "shadow-md ring-2 ring-primary/30"
                  : "hover:shadow-sm"
              }`}
              style={{
                backgroundColor:
                  currentEntry?.id === entry.id ? paperColor : "hsl(var(--muted) / 0.5)",
              }}
            >
              {/* Title */}
              <h3
                className="font-medium text-sm line-clamp-1 mb-1"
                style={{
                  color: currentEntry?.id === entry.id ? inkColor : undefined,
                }}
              >
                {entry.title || "Untitled Entry"}
              </h3>

              {/* Preview */}
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {entry.content || "No content yet..."}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(entry.created_at)}</span>
                </div>
                <div className="flex items-center">
                  {entry.privacy === "private" ? (
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <Users className="w-3 h-3 text-primary" />
                  )}
                </div>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
};
