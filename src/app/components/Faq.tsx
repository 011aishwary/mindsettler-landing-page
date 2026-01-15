import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import RollingBox from "./rollingBox";
import Link from "next/link";
import React, { useState } from 'react'
import { ChevronDown, Leaf, ThumbsUp } from "lucide-react";

const faqs = [
    { id: 1, question: "What happens in a session?", answer: "Each 60-minute session is a confidential conversation where we explore your thoughts, feelings, and challenges. We use structured psycho-education techniques to help you understand patterns and develop coping strategies. The first session focuses on understanding your needs and setting a foundation for your journey." },
    { id: 2, question: "Is everything I share confidential?", answer: "Absolutely. Confidentiality is the cornerstone of our practice. Everything discussed in sessions remains strictly between you and your counselor. We take your privacy extremely seriously, and you must acknowledge our confidentiality policy before your first session." },
    { id: 3, question: "How much do sessions cost?", answer: "Session pricing is designed to be accessible while reflecting the quality of personalized guidance you receive. Please contact us directly for current pricing details. Payment can be made via UPI or cash before each session." },
    { id: 4, question: "How do I book my first session?", answer: "Simply click 'Book a Session' on our website, choose between online or in-studio, select an available time slot, and complete the simple payment process. You'll receive a confirmation with all the details you need." },

    { id: 5, question: "What's the difference between online and in-studio sessions?", answer: "Both options provide the same quality of care. Online sessions offer convenience from your own space via secure video call. In-studio sessions take place in our calm, purpose-designed environment. Choose whatever feels most comfortable for you." },
    { id: 6, question: 'What if I need to cancel or reschedule?', answer: 'We understand life can be unpredictable. Please notify us at least 24 hours in advance if you need to reschedule. Note that we have a non-refund policy, so cancellations may not be eligible for refunds.' }


]
const FAQItem = ({ item, isOpen, onToggle }: {
    item: typeof faqs[0];
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative z-10"
        >
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
                    className={`w-full px-6 py-5 flex items-center justify-between text-left transition-colors ${isOpen ? "border-b border-primary/20" : ""
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
                                        className={`relative p-2 rounded-full transition-colors ${isHelpful ? "bg-primary/10" : "hover:bg-muted"
                                            }`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <ThumbsUp
                                            className={`w-4 h-4 transition-colors ${isHelpful ? "text-primary fill-primary" : "text-muted-foreground"
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
        </motion.div>
    );
};

const Faq = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [openId, setOpenId] = useState<number | null>(null);
    return (
        <div className="bg-cloudy-Apple min-h-fit w-screen py-2">
            <div className=" relative top-0 pt-10 text-center  text-pink-600 font-medium tracking-wider uppercase text-sm mb-2">
                FAQ
            </div>
            <h2 className="text-3xl relative  text-center lg:text-5xl font-serif font-bold text-purple-900 mb-2 leading-tight">
                Common Questions
            </h2>
            <div className="text-purple3 relative  text-center max-w-[60vw] mx-auto mb-12 max-lg:mb-0 text-md font-medium leading-relaxed">
                Find answers to frequently asked questions about MindSettler and our services.
            </div>
            <div className="max-w-2xl my-18 max-md:mx-4 mx-auto">

                {/* FAQ List */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {faqs.map((faq, index) => (
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
            </div>
            <div className="relative w-screen text-center my-12 mx-auto ">
                <span className="text-gray-700">Still have questions? 
                </span>
                <Link href="/faq" className="ml-2 font-medium hover:underline  ">
                    <span className=" text-Primary-pink"> FAQ page.</span>
                </Link>
                <div className="text-Primary-purple">Or Try our Chatbot.</div>
            </div>

        </div>
    )
}

export default Faq
