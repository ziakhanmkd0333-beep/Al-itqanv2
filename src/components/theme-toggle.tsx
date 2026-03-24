"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] animate-pulse" />
    );
  }

  const currentTheme = theme || resolvedTheme;

  const cycleTheme = () => {
    // next-themes treats "dark" specially, so we need to handle theme cycling carefully
    const nextTheme = currentTheme === "green" 
      ? "light" 
      : currentTheme === "light" 
        ? "dark" 
        : "green";
    setTheme(nextTheme);
  };

  const getIcon = () => {
    switch (currentTheme) {
      case "green":
        return <Leaf className="w-5 h-5 text-[#1A7A4A]" />;
      case "light":
        return <Sun className="w-5 h-5 text-[#F59E0B]" />;
      case "dark":
        return <Moon className="w-5 h-5 text-[#C9A84C]" />;
      default:
        return <Leaf className="w-5 h-5 text-[#1A7A4A]" />;
    }
  };

  const getLabel = () => {
    switch (currentTheme) {
      case "green":
        return "Islamic";
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      default:
        return "Islamic";
    }
  };

  return (
    <motion.button
      onClick={cycleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-card border border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Theme: ${getLabel()}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {getIcon()}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
