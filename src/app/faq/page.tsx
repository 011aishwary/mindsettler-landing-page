"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, ChevronDown, ThumbsUp, Leaf } from "lucide-react";

const faqData = [
  {
    id: 1,
    question: "How do I get started with MindSettler?",
    answer: "Getting started is simple. Create your free account, complete a brief wellness assessment, and we'll personalize your experience. Our guided introduction will walk you through the core features, including meditation sessions, mood tracking, and community support.",
  },
  {
    id: 2,
    question: "Is my personal information kept confidential?",
    answer: "Absolutely. Your privacy is our highest priority. All personal data is encrypted end-to-end, and we never share your information with third parties. You have complete control over your data and can export or delete it at any time.",
  },
  {
    id: 3,
    question: "What types of meditation are available?",
    answer: "We offer a diverse library including guided meditations, breathing exercises, body scans, loving-kindness practices, and mindfulness sessions. Content ranges from 3 to 45 minutes, suitable for beginners to advanced practitioners.",
  },
  {
    id: 4,
    question: "Can I connect with a mental health professional?",
    answer: "Yes, MindSettler offers optional connections to licensed therapists and counselors. You can schedule video sessions, chat consultations, or join group support circles facilitated by professionals. All providers are vetted and credentialed.",
  },
  {
    id: 5,
    question: "Is there a free version available?",
    answer: "We offer a generous free tier with access to essential features including daily meditations, basic mood tracking, and community forums. Premium features like personalized programs, unlimited content, and professional support require a subscription.",
  },
  {
    id: 6,
    question: "How does the mood tracking feature work?",
    answer: "Our intuitive mood tracker lets you log how you're feeling with just a tap. Over time, it reveals patterns and insights about your emotional well-being, helping you understand triggers and celebrate progress on your mental health journey.",
  },
];

const FAQItem = ({ item, isOpen, onToggle }: { 
  item: typeof faqData[0]; 
  isOpen: boolean; 
  onToggle: () => void;
}) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleHelpful = () => {
    if (!isHelpful) {
      setShowParticles(true);
      setIsHelpful(true);
      setTimeout(() => setShowParticles(false), 600);
    }
  };

  return (
    <motion.div
      className="glass bg-card/60 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl overflow-hidden cursor-pointer"
      initial={false}
      whileHover={{
        y: -2,
        boxShadow: "0 20px 40px -12px hsl(200 30% 30% / 0.15)",
      }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      <motion.button
        onClick={onToggle}
        className={`w-full px-6 py-5 flex items-center justify-between text-left transition-colors ${
          isOpen ? "border-b border-primary/20" : ""
        }`}
        whileTap={{ scale: 0.995 }}
      >
        <motion.span
          className="text-Primary-purple font-medium text-foreground pr-4 relative overflow-hidden"
          whileHover={{
            color: " #e66b8c",
          }}
        >
          {item.question}
          {/* Shimmer effect on hover */}
          <motion.span
            className="absolute inset-0 shimmer pointer-events-none opacity-0"
            whileHover={{ opacity: 1 }}
          />
        </motion.span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? "text-primary" : "text-muted-foreground"}`} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="px-6 py-5 space-y-4">
              {/* Staggered text reveal */}
              <motion.p
                className="text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                {item.answer}
              </motion.p>

              {/* Was this helpful button */}
              <motion.div
                className="flex items-center gap-2 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-sm text-muted-foreground">Was this helpful?</span>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHelpful();
                  }}
                  className={`relative p-2 rounded-full transition-colors ${
                    isHelpful ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ThumbsUp
                    className={`w-4 h-4 transition-colors ${
                      isHelpful ? "text-primary fill-primary" : "text-muted-foreground"
                    }`}
                  />
                  
                  {/* Particle burst effect */}
                  <AnimatePresence>
                    {showParticles && !shouldReduceMotion && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-2 h-2 text-primary"
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                              scale: [0, 1, 0],
                              x: Math.cos((i / 6) * Math.PI * 2) * 20,
                              y: Math.sin((i / 6) * Math.PI * 2) * 20,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          >
                            <Leaf className="w-2 h-2 text-primary" />
                          </motion.div>
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>

      {/* <div className="bg-gradient-to-br from-gradient-sage z-2 via-background2 to-gradient-sky absolute h-screen w-screen inset-0"></div>
      <div className="bg-gradient-sky z-1 absolute h-screen w-screen "></div>
      <div className="bg-white z-0 absolute h-screen w-screen "></div>
      <div className="absolute inset-0 w-4xl z-3 h-4xl blur-3xl backdrop-blur-3xl bg-sky top-10 -left-10 rounded-full"></div>
      <div className="absolute w-5xl h-5xl inset-0 z-3  backdrop-blur-3xl blur-3xl bg-Primary-pink/6 bottom-0 top-0 left-30 rounded-full"></div> */}
    <div className="min-h-screen z-5 absolute w-screen h-screen overflow-scroll    pt-10 px-6">
      <div className="max-w-2xl my-18 mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-Primary-purple mb-4 tracking-tight">
            Clarity Garden
          </h1>
          <p className="text-lg text-Primary-purple/80">
            Find answers to guide your journey toward peace of mind
          </p>
        </motion.div>

        {/* Living Search Bar */}
        <motion.div
          className="relative mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className={`glass-strong bg-card/75 backdrop-blur-2xl border border-white/40 shadow-xl rounded-full flex items-center gap-4 px-6 py-4 transition-all ${
              isFocused ? "ring-2 ring-primary/30" : ""
            }`}
            animate={{
              scale: isFocused ? 1.02 : 1,
              boxShadow: isFocused
                ? "0 20px 50px -10px hsl(140 30% 45% / 0.2)"
                : "0 8px 32px hsl(200 30% 30% / 0.08)",
            }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
          >
            {/* Glow effect behind */}
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>

            <Search className={`w-5 h-5 transition-colors ${isFocused ? "text-primary" : "text-muted-foreground"}`} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            />
          </motion.div>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <FAQItem
                item={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredFaqs.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground">
              No questions found. Try a different search term.
            </p>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
};

export default FAQ;
