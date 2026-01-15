"use client";
import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView, useReducedMotion } from "framer-motion";
import { ExternalLink, Clock, Tag } from "lucide-react";

const categories = ["All", "Anxiety", "Meditation", "Stories", "Self-Care"];

const resourcesData = [
  {
    id: 1,
    title: "Understanding Anxiety: A Gentle Guide",
    category: "Anxiety",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    tags: ["beginner", "anxiety"],
    aspect: "tall",
  },
  {
    id: 2,
    title: "Morning Meditation Rituals",
    category: "Meditation",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&h=400&fit=crop",
    tags: ["meditation", "routine"],
    aspect: "wide",
  },
  {
    id: 3,
    title: "Finding Peace in Uncertainty",
    category: "Stories",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop",
    tags: ["personal", "growth"],
    aspect: "square",
  },
  {
    id: 4,
    title: "Breathwork for Beginners",
    category: "Meditation",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=600&h=400&fit=crop",
    tags: ["breathing", "beginner"],
    aspect: "tall",
  },
  {
    id: 5,
    title: "Creating Your Self-Care Sanctuary",
    category: "Self-Care",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop",
    tags: ["home", "wellness"],
    aspect: "wide",
  },
  {
    id: 6,
    title: "Overcoming Social Anxiety",
    category: "Anxiety",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    tags: ["social", "anxiety"],
    aspect: "square",
  },
  {
    id: 7,
    title: "The Art of Letting Go",
    category: "Stories",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop",
    tags: ["personal", "mindfulness"],
    aspect: "tall",
  },
  {
    id: 8,
    title: "Evening Wind-Down Routine",
    category: "Self-Care",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop",
    tags: ["sleep", "routine"],
    aspect: "square",
  },
];

const ResourceCard = ({ resource, index }: { resource: typeof resourcesData[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(normalizedX * 0.5);
    mouseY.set(normalizedY * 0.5);
  };

  const handleMouseEnter = () => {
    if (!shouldReduceMotion) scale.set(1.02);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  const aspectClass = {
    tall: "md:row-span-2",
    wide: "md:col-span-2",
    square: "",
  }[resource.aspect] || "";

  return (
    <motion.div
      ref={ref}
      className={`${aspectClass} group relative`}
      style={{
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        scale,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="glass  bg-card/60 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl overflow-hidden h-full cursor-pointer shadow-glass hover:shadow-elevation transition-shadow">
        {/* Image container */}
        <div className="relative  overflow-hidden aspect-[4/3]">
          <motion.img
            src={resource.image}
            alt={resource.title}
            className="w-full  h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          />
          
          {/* Frosted overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent backdrop-blur-sm flex items-end justify-center pb-6"
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/90 backdrop-blur-sm text-foreground text-sm font-medium shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Read Article
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          </motion.div>
          
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm text-xs font-medium text-foreground">
              {resource.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {resource.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {resource.readTime}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const shouldReduceMotion = useReducedMotion();

  const filteredResources = activeCategory === "All"
    ? resourcesData
    : resourcesData.filter((r) => r.category === activeCategory);

  return (
    <div className="min-h-screen mt-16 py-8 px-6 bg-background2">
        {/* <div className="absolute w-96 h-96  backdrop-blur-7xl blur-3xl bg-green-400/12 top-0 -left-10 rounded-full"></div>
      <div className="absolute w-96 h-96  backdrop-blur-7xl blur-3xl bg-Primary-pink/15 top-10 -right-10 rounded-full"></div> */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight">
            Knowledge Stream
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Curated resources to nurture your mind and support your journey
          </p>
        </motion.div>

        {/* Liquid Filter Navigation */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass bg-card/60 backdrop-blur-xl border border-white/30 shadow-lg rounded-full p-1.5 flex gap-1">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="filter-blob"
                    className="absolute inset-0 bg-primary rounded-full"
                    style={{
                      borderRadius: shouldReduceMotion ? "9999px" : undefined,
                    }}
                    transition={{
                      type: "spring",
                      damping: 20,
                      stiffness: 150,
                    }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-max md:auto-rows-fr"
          layout
        >
          {filteredResources.map((resource, index) => (
            <ResourceCard key={resource.id} resource={resource} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;
