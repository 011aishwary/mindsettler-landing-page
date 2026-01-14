import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Settings, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button1";
// import { useAuth } from "@/contexts/AuthContext";
import { useDiaryPreferences } from "../../../hooks/useDiaryPreferences";
import { useDiaryEntries } from "@/hooks/useDiaryEntries";
import { useDiarySounds } from "@/hooks/useDiarySounds";
import { DiaryOpenAnimation } from "@/components/diary/DiaryOpenAnimation";
import { DiaryPreferencesPanel } from "@/components/diary/DiaryPreferencesPanel";
import { DiaryEntryEditor } from "@/components/diary/DiaryEntryEditor";
import { DiaryEntriesList } from "@/components/diary/DiaryEntriesList";
import { PageFlipAnimation } from "@/components/diary/PageFlipAnimation";
import logo from "@/assets/mindsettler-logo.png";

const Diary = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { preferences, loading: prefsLoading, updatePreferences } = useDiaryPreferences();
  const {
    entries,
    loading: entriesLoading,
    currentEntry,
    setCurrentEntry,
    createEntry,
    updateEntry,
    deleteEntry,
  } = useDiaryEntries();

  const [diaryOpen, setDiaryOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isPageFlipping, setIsPageFlipping] = useState(false);

  const { playPageFlip, playTypingSound } = useDiarySounds(preferences.sound_enabled);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Auto-select first entry or create new one
  useEffect(() => {
    if (!entriesLoading && entries.length > 0 && !currentEntry) {
      setCurrentEntry(entries[0]);
    }
  }, [entries, entriesLoading, currentEntry, setCurrentEntry]);

  const handleCreateEntry = async () => {
    // Start page flip animation
    setIsPageFlipping(true);
    playPageFlip();
  };

  const handlePageFlipComplete = async () => {
    setIsPageFlipping(false);
    await createEntry();
    setShowSidebar(false);
  };

  const handleSelectEntry = (entry: typeof entries[0]) => {
    setCurrentEntry(entry);
    setShowSidebar(false);
  };

  if (authLoading || prefsLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "hsl(var(--background))" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Page Flip Animation */}
      <PageFlipAnimation
        isFlipping={isPageFlipping}
        paperColor={preferences.paper_color}
        onComplete={handlePageFlipComplete}
      />

      {/* Opening Animation */}
      <DiaryOpenAnimation
        isOpen={diaryOpen}
        onAnimationComplete={() => setDiaryOpen(true)}
        paperColor={preferences.paper_color}
      />

      {/* Main Diary Interface */}
      <AnimatePresence>
        {diaryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
            style={{ backgroundColor: preferences.background_color }}
          >
            {/* Header */}
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="sticky top-0 z-30 backdrop-blur-md border-b"
              style={{
                backgroundColor: `${preferences.background_color}ee`,
                borderColor: `${preferences.ink_color}15`,
              }}
            >
              <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Left */}
                <div className="flex items-center gap-4">
                  <Link to="/">
                    <motion.img
                      src={logo}
                      alt="MindSettler"
                      className="h-8 w-auto"
                      whileHover={{ scale: 1.05 }}
                    />
                  </Link>
                  <div
                    className="hidden md:block h-6 w-px opacity-20"
                    style={{ backgroundColor: preferences.ink_color }}
                  />
                  <span
                    className="hidden md:block font-heading text-lg"
                    style={{ color: preferences.ink_color }}
                  >
                    My Diary
                  </span>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(true)}
                    className="rounded-full"
                    style={{ color: preferences.ink_color }}
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="md:hidden rounded-full"
                    style={{ color: preferences.ink_color }}
                  >
                    {showSidebar ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </Button>
                  <Link to="/" className="hidden md:block">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      style={{ color: preferences.ink_color }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.header>

            {/* Content */}
            <div className="container mx-auto px-4 py-6 flex gap-6 h-[calc(100vh-80px)]">
              {/* Sidebar - Desktop */}
              <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden md:block w-80 flex-shrink-0"
              >
                <div
                  className="h-full rounded-2xl p-4"
                  style={{
                    backgroundColor: `${preferences.paper_color}`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  }}
                >
                  <DiaryEntriesList
                    entries={entries}
                    currentEntry={currentEntry}
                    onSelectEntry={handleSelectEntry}
                    onCreateEntry={handleCreateEntry}
                    paperColor={preferences.paper_color}
                    inkColor={preferences.ink_color}
                  />
                </div>
              </motion.aside>

              {/* Sidebar - Mobile */}
              <AnimatePresence>
                {showSidebar && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowSidebar(false)}
                      className="fixed inset-0 z-40 bg-black/20 md:hidden"
                    />
                    <motion.aside
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="fixed left-0 top-0 bottom-0 w-80 z-50 p-4 pt-20 md:hidden"
                      style={{
                        backgroundColor: preferences.paper_color,
                        boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
                      }}
                    >
                      <DiaryEntriesList
                        entries={entries}
                        currentEntry={currentEntry}
                        onSelectEntry={handleSelectEntry}
                        onCreateEntry={handleCreateEntry}
                        paperColor={preferences.paper_color}
                        inkColor={preferences.ink_color}
                      />
                    </motion.aside>
                  </>
                )}
              </AnimatePresence>

              {/* Main Editor */}
              <motion.main
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex-1 min-w-0"
              >
                {currentEntry ? (
                  <DiaryEntryEditor
                    key={currentEntry.id}
                    entry={currentEntry}
                    preferences={preferences}
                    onUpdate={updateEntry}
                    onDelete={deleteEntry}
                    onTypingSound={playTypingSound}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="max-w-md"
                    >
                      <div
                        className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{
                          backgroundColor: `${preferences.ink_color}10`,
                        }}
                      >
                        <span className="text-4xl">📖</span>
                      </div>
                      <h2
                        className="font-heading text-2xl font-semibold mb-3"
                        style={{ color: preferences.ink_color }}
                      >
                        Welcome to Your Diary
                      </h2>
                      <p
                        className="opacity-60 mb-6"
                        style={{ color: preferences.ink_color }}
                      >
                        A safe space for your thoughts, feelings, and reflections.
                        Start writing your first entry.
                      </p>
                      <Button
                        onClick={handleCreateEntry}
                        className="rounded-full"
                        style={{
                          backgroundColor: preferences.ink_color,
                          color: preferences.paper_color,
                        }}
                      >
                        Create Your First Entry
                      </Button>
                    </motion.div>
                  </div>
                )}
              </motion.main>
            </div>

            {/* Preferences Panel */}
            <DiaryPreferencesPanel
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
              preferences={preferences}
              onUpdatePreferences={updatePreferences}
            />

            {/* Overlay when settings open */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowSettings(false)}
                  className="fixed inset-0 z-30 bg-black/20"
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Diary;
