import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Lock, Users, Check, Trash2, Download, Edit3 } from "lucide-react";
import { Button } from "../ui/button1";
import { DiaryEntry } from "../../../../hooks/useDiaryEntries";
import { DiaryPreferences } from "../../../../hooks/useDiaryPreferences";
import { toast } from "../../../../hooks/use-toast";
import jsPDF from "jspdf";

interface DiaryEntryEditorProps {
  entry: DiaryEntry;
  preferences: DiaryPreferences;
  onUpdate: (id: string, updates: Partial<DiaryEntry>) => void;
  onDelete: (id: string) => void;
  onTypingSound?: () => void;
}

const getFontFamily = (fontFamily: string) => {
  switch (fontFamily) {
    case "handwriting":
      return "'Caveat', cursive";
    case "serif":
      return "Georgia, serif";
    case "mono":
      return "'Courier New', monospace";
    default:
      return "Inter, sans-serif";
  }
};

export const DiaryEntryEditor = ({
  entry,
  preferences,
  onUpdate,
  onDelete,
  onTypingSound,
}: DiaryEntryEditorProps) => {
  const [content, setContent] = useState(entry.content);
  const [title, setTitle] = useState(entry.title || "");
  const [privacy, setPrivacy] = useState<"private" | "shared">(entry.privacy);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save functionality
  const autoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      await onUpdate(entry.id, { content, title, privacy });
      setLastSaved(new Date());
      setIsSaving(false);
    }, 1000);
  }, [content, title, privacy, entry.id, onUpdate]);

  useEffect(() => {
    autoSave();
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, title, privacy, autoSave]);

  // Update local state when entry changes
  useEffect(() => {
    setContent(entry.content);
    setTitle(entry.title || "");
    setPrivacy(entry.privacy);
  }, [entry.id, entry.content, entry.title, entry.privacy]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(title || "Untitled Entry", margin, 30);

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(128, 128, 128);
    doc.text(
      new Date(entry.created_at).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      margin,
      40
    );

    // Content
    doc.setFontSize(12);
    doc.setTextColor(45, 45, 45);
    const lines = doc.splitTextToSize(content, maxWidth);
    doc.text(lines, margin, 55);

    // Save
    doc.save(`diary-${entry.id.slice(0, 8)}.pdf`);

    toast({
      title: "PDF Exported",
      description: "Your diary entry has been saved as a PDF",
    });
  };

  const togglePrivacy = () => {
    const newPrivacy = privacy === "private" ? "shared" : "private";
    setPrivacy(newPrivacy);
    toast({
      title: newPrivacy === "private" ? "Entry is now private" : "Entry shared",
      description:
        newPrivacy === "private"
          ? "Only you can see this entry"
          : "Your therapist can now view this entry",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {/* Paper Container */}
      <div
        className="flex-1 rounded-3xl shadow-xl overflow-hidden relative"
        style={{
          backgroundColor: preferences.paper_color,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
        }}
      >
        {/* Left margin line */}
        <div
          className="absolute left-16 top-0 bottom-0 w-px opacity-20"
          style={{ backgroundColor: "#e8a8a8" }}
        />

        {/* Content Area */}
        <div className="h-full p-8 md:p-12 pl-20 md:pl-24 flex flex-col">
          <span className="text-black"
          style={{
              color: preferences.ink_color,
              fontFamily: getFontFamily(preferences.font_family),
            }}>Title</span>
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title of your entry..."
            className="w-full bg-transparent border-b-2 border-transparent hover:border-black/5 focus:border-black/10 outline-none text-2xl md:text-3xl font-bold mb-4 pb-2 placeholder:opacity-40 transition-colors"
            style={{
              color: preferences.ink_color,
              fontFamily: getFontFamily(preferences.font_family),
            }}
          />

          {/* Date */}
          <p
            className="text-sm opacity-50 mb-6"
            style={{ color: preferences.ink_color }}
          >
            {new Date(entry.created_at).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {/* Content Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                onTypingSound?.();
              }}
              onKeyDown={(e) => {
                // Play sound on keydown for more responsive feel
                if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
                  onTypingSound?.();
                }
              }}
              placeholder="Begin writing your thoughts..."
              className="w-full h-full bg-transparent border-none outline-none resize-none text-lg md:text-xl leading-[30px] placeholder:opacity-40"
              style={{
                color: preferences.ink_color,
                fontFamily: getFontFamily(preferences.font_family),
                lineHeight: "30px",
                caretColor: preferences.ink_color,
              }}
            />

            {/* Pen cursor effect */}
            <motion.div
              className="absolute pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: preferences.ink_color,
                opacity: 0.5,
              }}
            />
          </div>
        </div>

        {/* Decorative corner fold */}
        <div
          className="absolute bottom-0 right-0 w-16 h-16"
          style={{
            background: `linear-gradient(135deg, transparent 50%, ${preferences.paper_color} 50%)`,
            filter: "brightness(0.95)",
            boxShadow: "-2px -2px 5px rgba(0,0,0,0.05)",
          }}
        />
      </div>

      {/* Bottom Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 flex items-center justify-between flex-wrap gap-4"
      >
        {/* Save Status */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
              />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span>Saved at {lastSaved.toLocaleTimeString()}</span>
            </>
          ) : (
            <span className="flex items-center gap-1">
              <Edit3 className="w-4 h-4" /> Draft
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Privacy Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={togglePrivacy}
            className={`rounded-full ${
              privacy === "shared"
                ? "bg-primary/10 border-primary text-primary"
                : ""
            }`}
          >
            {privacy === "private" ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Private
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Shared
              </>
            )}
          </Button>

          {/* Export PDF */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="rounded-full"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>

          {/* Delete */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(entry.id)}
            className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
