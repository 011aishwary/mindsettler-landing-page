"use client";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Leaf, Heart, Sparkles } from "lucide-react";

const featureCards = [
  {
    title: "Clarity Garden",
    description: "Find answers to guide your mental wellness journey",
    icon: Sparkles,
    path: "/faq",
    gradient: "from-gradient-sage to-gradient-cream",
  },
  {
    title: "Knowledge Stream",
    description: "Curated resources to nurture your mind",
    icon: Leaf,
    path: "/resources",
    gradient: "from-gradient-sky to-gradient-lavender",
  },
  {
    title: "Safe Harbor",
    description: "Connect with us whenever you need support",
    icon: Heart,
    path: "/contact",
    gradient: "from-gradient-cream to-gradient-sage",
  },
];

const Index1 = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-background2   px-6 flex flex-col items-center justify-center">
        {/* <div className="absolute w-96 h-96  backdrop-blur-7xl blur-3xl bg-green-400/12 top-0 -left-10 rounded-full"></div>
      <div className="absolute w-96 h-96  backdrop-blur-7xl blur-3xl bg-Primary-pink/15 top-10 -right-10 rounded-full"></div> */}
      <div className="max-w-4xl mx-auto text-center py-10">
        {/* Hero Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* Logo Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass bg-card/60 backdrop-blur-xl border border-white/30 shadow-lg  mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              User Engagement Hub
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-semibold text-Primary-purple mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Welcome to{" "}
            <span className="text-Primary-pink">MindSettler</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Your digital zen garden for mental wellness. 
            Explore resources, find clarity, and connect with care.
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            
            return (
              <Link key={card.path} href={card.path}>
                <motion.div
                  className="group relative glass bg-card/60 backdrop-blur-xl border border-white/30 shadow-lg rounded-3xl p-8 h-full text-left overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{
                    y: -8,
                    transition: { type: "spring", damping: 20, stiffness: 200 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Gradient background on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  />
                  
                  {/* Icon */}
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative z-10"
                    whileHover={shouldReduceMotion ? {} : { rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-2 relative z-10 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 relative z-10">
                    {card.description}
                  </p>

                  {/* Arrow */}
                  <motion.div
                    className="flex items-center gap-2 text-sm font-medium text-primary relative z-10"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          className="mt-20 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/30"
              animate={shouldReduceMotion ? {} : {
                y: [0, -4, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Index1;
