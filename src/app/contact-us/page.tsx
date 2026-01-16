"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Instagram, Twitter, Mail, Check, Loader2, Send, Heart } from "lucide-react";

type FormState = "idle" | "loading" | "success";

const AbstractMascot = () => {
  const shouldReduceMotion = useReducedMotion();
  const  typingTimeoutRef = useRef<NodeJS.Timeout | null >(null);
  
  return (
    <div className="relative w-full h-80 md:h-full flex items-center justify-center">
      
      {/* Main blob */}
      <motion.div
        className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-Primary-pink/20 to-accent/20 blur-xl"
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Secondary blob */}
      <motion.div
        className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-tl from-gradient-sage/50 to-gradient-cream/50 blur-lg"
        animate={shouldReduceMotion ? {} : {
          x: [0, 20, -10, 0],
          y: [0, -15, 10, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      
      {/* Inner glow */}
      <motion.div
        className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-card/60 backdrop-blur-xl shadow-glass flex items-center justify-center"
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Heart className="w-8 h-8 md:w-10 md:h-10 text-primary" />
      </motion.div>
    </div>
  );
};

const SocialLink = ({ icon: Icon, label, href }: { icon: typeof Instagram; label: string; href: string }) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      
      <motion.div
        animate={shouldReduceMotion ? {} : { y: [0, -2, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Icon className="w-5 h-5 text-primary" />
      </motion.div>
      <span className="text-sm text-foreground">{label}</span>
    </motion.a>
  );
};

const EmpathicInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  textarea = false,
  isTyping = false,
}: {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  textarea?: boolean;
  isTyping?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  
  const inputClasses = `w-full px-4 py-3 rounded-xl transition-all duration-300 outline-none ${
    isFocused
      ? "bg-card shadow-glow-accent"
      : "bg-muted/50"
  } text-foreground placeholder:text-muted-foreground`;

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        {/* Focus bloom effect */}
        <AnimatePresence>
          {isFocused && !shouldReduceMotion && (
            <motion.div
              className="absolute inset-0 -z-10 rounded-xl bg-accent/20 blur-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
        
        {textarea ? (
          <div className="relative">
            <textarea
              name={name}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              rows={5}
              className={`${inputClasses} resize-none`}
            />
            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && isFocused && (
                <motion.div
                  className="absolute bottom-3 right-3 flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary/50"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={inputClasses}
          />
        )}
      </div>
    </div>
  );
};

const MorphingButton = ({ state, onClick }: { state: FormState; onClick: () => void }) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.button
      onClick={onClick}
      disabled={state !== "idle"}
      className="relative w-full overflow-hidden rounded-xl bg-primary text-primary-foreground font-medium transition-colors disabled:cursor-not-allowed"
      animate={{
        width: state === "loading" || state === "success" ? 56 : "100%",
        height: 56,
        borderRadius: state === "loading" || state === "success" ? 28 : 12,
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 200,
      }}
      whileHover={state === "idle" ? { scale: 1.01 } : {}}
      whileTap={state === "idle" ? { scale: 0.99 } : {}}
    >
      {/* Liquid fill effect on hover */}
      {state === "idle" && (
        <motion.div
          className="absolute inset-0 bg-primary-glow origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}
      
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.span
            key="idle"
            className="relative z-10 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Send className="w-4 h-4" />
            Send Message
          </motion.span>
        )}
        
        {state === "loading" && (
          <motion.div
            key="loading"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.2 },
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
            }}
          >
            <Loader2 className="w-5 h-5" />
          </motion.div>
        )}
        
        {state === "success" && (
          <motion.div
            key="success"
            className="absolute inset-0 flex items-center justify-center bg-primary"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              damping: 15,
              stiffness: 300,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Check className="w-6 h-6" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    
    if (e.target.name === "message") {
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const handleSubmit = () => {
    if (formState !== "idle") return;
    
    setFormState("loading");
    
    // Simulate API call
    setTimeout(() => {
      setFormState("success");
      setTimeout(() => {
        setFormState("idle");
        setFormData({ name: "", email: "", message: "" });
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen mt-16 py-8 px-6 bg-background2">
       <div className="absolute w-96 h-96  backdrop-blur-7xl blur-3xl bg-green-400/12 top-0 -left-10 rounded-full"></div>
      <div className="absolute w-96 h-96  backdrop-blur-7xl blur-3xl bg-Primary-pink/15 top-10 -right-10 rounded-full"></div>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight">
            Safe Harbor
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            We're here to listen. Reach out whenever you need support.
          </p>
        </motion.div>

        {/* Split Layout */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Left Side - Mascot & Social */}
          <div className="space-y-8">
            <AbstractMascot />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Connect With Us
              </h3>
              <div className="space-y-3">
                <SocialLink
                  icon={Instagram}
                  label="@mindsettler"
                  href="https://instagram.com/mindsettler"
                />
                <SocialLink
                  icon={Twitter}
                  label="@mindsettler"
                  href="https://twitter.com/mindsettler"
                />
                <SocialLink
                  icon={Mail}
                  label="hello@mindsettler.com"
                  href="mailto:hello@mindsettler.com"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <motion.div
            className="glass-strong  bg-card/75 backdrop-blur-2xl border border-white/40 shadow-xl rounded-3xl p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-6">
              <EmpathicInput
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="How should we address you?"
              />
              
              <EmpathicInput
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Where can we reach you?"
              />
              
              <EmpathicInput
                label="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Share what's on your mind..."
                textarea
                isTyping={isTyping}
              />

              <div className="pt-2 flex flex-col items-center gap-3">
                <MorphingButton state={formState} onClick={handleSubmit} />
                
                <AnimatePresence>
                  {formState === "success" && (
                    <motion.p
                      className="text-sm text-primary font-medium"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      Message Sent ✨
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
