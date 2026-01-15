import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { HelpCircle, BookOpen, Mail, Leaf } from "lucide-react";

const navItems = [
  { path: "/faq", label: "FAQ", icon: HelpCircle },
  { path: "/resources", label: "Resources", icon: BookOpen },
  { path: "/contact", label: "Contact", icon: Mail },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25, stiffness: 120 }}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            className="w-10 h-10 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Leaf className="w-5 h-5 text-primary" />
          </motion.div>
          <span className="text-lg font-semibold text-foreground tracking-tight">
            MindSettler
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="bg-card/60 backdrop-blur-xl border border-white/30 shadow-lg rounded-full px-2 py-2 flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 text-sm font-medium">
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </motion.header>
  );
};

export default Navigation;
