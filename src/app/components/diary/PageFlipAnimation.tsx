import { motion, AnimatePresence } from "framer-motion";

interface PageFlipAnimationProps {
  isFlipping: boolean;
  paperColor: string;
  onComplete: () => void;
}

export const PageFlipAnimation = ({
  isFlipping,
  paperColor,
  onComplete,
}: PageFlipAnimationProps) => {
  return (
    <AnimatePresence>
      {isFlipping && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            if (!isFlipping) onComplete();
          }}
        >
          {/* Book container */}
          <div
            className="relative"
            style={{
              perspective: "1500px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Page that flips */}
            <motion.div
              className="relative rounded-r-lg shadow-2xl"
              style={{
                width: "min(400px, 80vw)",
                height: "min(550px, 70vh)",
                backgroundColor: paperColor,
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
                `,
                backgroundSize: "20px 30px",
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -180 }}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
              onAnimationComplete={onComplete}
            >
              {/* Front of page */}
              <div
                className="absolute inset-0 rounded-r-lg"
                style={{
                  backgroundColor: paperColor,
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Red margin line */}
                <div
                  className="absolute left-12 top-0 bottom-0 w-px"
                  style={{ backgroundColor: "#e8a8a8", opacity: 0.5 }}
                />
                {/* Horizontal lines */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 h-px"
                    style={{
                      top: `${60 + i * 30}px`,
                      backgroundColor: "#c5c5c5",
                      opacity: 0.3,
                    }}
                  />
                ))}
                {/* Page curl shadow */}
                <motion.div
                  className="absolute inset-y-0 right-0 w-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  style={{
                    background:
                      "linear-gradient(to left, rgba(0,0,0,0.15), transparent)",
                  }}
                />
              </div>

              {/* Back of page */}
              <div
                className="absolute inset-0 rounded-l-lg"
                style={{
                  backgroundColor: paperColor,
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  filter: "brightness(0.97)",
                }}
              >
                {/* Red margin line */}
                <div
                  className="absolute right-12 top-0 bottom-0 w-px"
                  style={{ backgroundColor: "#e8a8a8", opacity: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Underlying page (new page) */}
            <motion.div
              className="absolute inset-0 rounded-r-lg -z-10"
              style={{
                backgroundColor: paperColor,
                filter: "brightness(0.99)",
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
                `,
                backgroundSize: "20px 30px",
              }}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
            >
              {/* Red margin line */}
              <div
                className="absolute left-12 top-0 bottom-0 w-px"
                style={{ backgroundColor: "#e8a8a8", opacity: 0.5 }}
              />
            </motion.div>
          </div>

          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 -z-20"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
