import { motion } from "framer-motion";
import { Settings, Palette, Type, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "../ui/button1";
import { Label } from "../ui/Label";
import { Switch } from "../ui/switch";
import { DiaryPreferences } from "../../../../hooks/useDiaryPreferences";

interface DiaryPreferencesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: DiaryPreferences;
  onUpdatePreferences: (prefs: Partial<DiaryPreferences>) => void;
}

const colorPresets = [
  { name: "Cream", background: "#faf8f5", paper: "#fffef9", ink: "#2d2d2d" },
  { name: "Lavender", background: "#f5f3fa", paper: "#faf9fc", ink: "#3F2965" },
  { name: "Blush", background: "#fdf5f7", paper: "#fff9fa", ink: "#6b4350" },
  { name: "Sage", background: "#f5f8f5", paper: "#fafcfa", ink: "#3d4a3d" },
  { name: "Ocean", background: "#f3f7fa", paper: "#f9fbfc", ink: "#2d4a5e" },
  { name: "Sunset", background: "#faf6f3", paper: "#fcfaf8", ink: "#5e3d2d" },
];

const fontPresets = [
  { name: "Handwriting", value: "handwriting", preview: "Caveat" },
  { name: "Serif", value: "serif", preview: "Georgia" },
  { name: "Sans", value: "sans", preview: "Inter" },
  { name: "Mono", value: "mono", preview: "monospace" },
];

export const DiaryPreferencesPanel = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}: DiaryPreferencesPanelProps) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 bottom-0 w-80 md:w-96 z-40 shadow-2xl overflow-y-auto"
      style={{ backgroundColor: "hsl(var(--card))" }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Customize Diary
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Color Theme Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <Label className="font-medium text-foreground">Color Theme</Label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {colorPresets.map((preset) => (
              <motion.button
                key={preset.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  onUpdatePreferences({
                    background_color: preset.background,
                    paper_color: preset.paper,
                    ink_color: preset.ink,
                  })
                }
                className={`relative p-3 rounded-xl border-2 transition-all ${preferences.paper_color === preset.paper
                    ? "border-primary shadow-md"
                    : "border-transparent hover:border-muted"
                  }`}
                style={{ backgroundColor: preset.paper }}
              >
                <div
                  className="w-full h-8 rounded-md mb-2"
                  style={{ backgroundColor: preset.background }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: preset.ink }}
                >
                  {preset.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">Background</Label>
            <input
              type="color"
              value={preferences.background_color}
              onChange={(e) =>
                onUpdatePreferences({ background_color: e.target.value })
              }
              className="w-10 h-10 rounded-lg cursor-pointer border-2 border-muted"
              aria-label="Background color picker"
              title="Choose background color"
            />

          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">Paper</Label>
            <input
              type="color"
              value={preferences.paper_color}
              onChange={(e) =>
                onUpdatePreferences({ paper_color: e.target.value })
              }
              className="w-10 h-10 rounded-lg cursor-pointer border-2 border-muted"
              aria-label="Paper color picker"
              title="Choose paper color"
            />

          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">Ink</Label>
            <input
              type="color"
              value={preferences.ink_color}
              onChange={(e) =>
                onUpdatePreferences({ ink_color: e.target.value })
              }
              className="w-10 h-10 rounded-lg cursor-pointer border-2 border-muted"
              aria-label="Ink color picker"
              title="Choose ink color"
            />
          </div>
        </div>

        {/* Font Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-4 h-4 text-muted-foreground" />
            <Label className="font-medium text-foreground">Font Style</Label>
          </div>
          <div className="space-y-2">
            {fontPresets.map((font) => (
              <motion.button
                key={font.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onUpdatePreferences({ font_family: font.value })}
                className={`w-full p-4 rounded-xl text-left transition-all ${preferences.font_family === font.value
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-muted/50 border-2 border-transparent hover:border-muted"
                  }`}
              >
                <span
                  className="text-lg"
                  style={{
                    fontFamily: font.preview,
                    color: preferences.ink_color,
                  }}
                >
                  {font.name}
                </span>
                <p
                  className="text-sm mt-1 opacity-60"
                  style={{ fontFamily: font.preview }}
                >
                  The quick brown fox jumps...
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-3">
            {preferences.sound_enabled ? (
              <Volume2 className="w-5 h-5 text-primary" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <Label className="font-medium text-foreground">Page Sounds</Label>
              <p className="text-xs text-muted-foreground">
                Gentle sounds while writing
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.sound_enabled}
            onCheckedChange={(checked) =>
              onUpdatePreferences({ sound_enabled: checked })
            }
          />
        </div>
      </div>
    </motion.div>
  );
};
