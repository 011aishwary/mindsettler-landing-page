import { motion, AnimatePresence } from "framer-motion";
import { Book } from "lucide-react";

interface DiaryOpenAnimationProps {
  isOpen: boolean;
  onAnimationComplete: () => void;
  paperColor: string;
}

export const DiaryOpenAnimation = ({
  isOpen,
  onAnimationComplete,
  paperColor,
}: DiaryOpenAnimationProps) => {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="fixed inset-0 pt-20  z-50 flex items-center justify-center"
          style={{ backgroundColor: "#bfb6d3" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          {/* Book Container */}
          <motion.div
            className="relative perspective-1000"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Cover */}
            <motion.div
              className="absolute w-80 h-[420px] rounded-r-lg shadow-2xl"
              style={{
                background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)`,
                transformOrigin: "left center",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -10 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />

            {/* Pages Stack */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-80 h-[420px] rounded-r-md"
                style={{
                  backgroundColor: paperColor,
                  transformOrigin: "left center",
                  boxShadow: "1px 0 3px rgba(0,0,0,0.05)",
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -5 - i * 2 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.05 }}
              />
            ))}

            {/* Front Cover */}
            <motion.div
              className="relative bg-gradient-sage w-80 h-[420px] rounded-lg shadow-2xl flex flex-col items-center justify-center gap-6"
              style={{
                // background: ``,
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -160 }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
              onAnimationComplete={onAnimationComplete}
            >
              {/* Cover Content */}
              <motion.div
                className="text-center text-Primary-purple"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <Book className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <h2 className="font-heading text-2xl font-bold">My Diary</h2>
                <p className="text-sm opacity-70 mt-2">Personal & Private</p>
              </motion.div>

              {/* Binding Detail */}
              <div
                className="absolute bg-blueGray/30 left-0 top-0 bottom-0 w-4 rounded-l-lg"
                // style={{
                //   background: "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, transparent 100%)",
                // }}
              />
            </motion.div>

            {/* Spine */}
            <motion.div
              className="absolute  left-0 top-0 w-6 h-[420px] rounded-l-md"
              style={{
                // background: `linear-gradient(90deg, hsl(var(--primary) / 0.7) 0%, hsl(var(--primary)) 100%)`,
                transformOrigin: "left center",
              }}
            />
          </motion.div>

          {/* Opening Text */}
          <motion.p
            className="absolute bottom-20 text-black/80 font-heading"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, times: [0, 0.2, 0.8, 1] }}
          >
            Opening your diary...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
