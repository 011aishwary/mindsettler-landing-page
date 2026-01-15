import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 20,
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 120,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -20,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 200,
      duration: 0.4,
    },
  },
};

const reducedMotionVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion ? reducedMotionVariants : pageVariants;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="min-h-screen pt-24 pb-12"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
