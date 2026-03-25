"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleComplete = useCallback(() => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  }, [onComplete]);

  useEffect(() => {
    const timer = setTimeout(handleComplete, 1500); // Reduced from 3500ms
    return () => clearTimeout(timer);
  }, [handleComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-pointer"
          style={{
            background: "radial-gradient(ellipse at center, #0D4D2F 0%, #071410 100%)"
          }}
          onClick={handleComplete} // Allow click to skip
        >
          {/* Simplified Static Pattern - No Rotation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <svg width="400" height="400" viewBox="0 0 200 200">
              <defs>
                <pattern id="islamic-hex" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0L40 10L40 30L20 40L0 30L0 10Z" fill="none" stroke="#C9A84C" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="200" height="200" fill="url(#islamic-hex)" />
            </svg>
          </div>

          {/* Single Ring Animation */}
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full border-2 border-[#C9A84C]/30"
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Central Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative mb-6"
              style={{ position: 'relative', height: '120px', width: '120px' }}
            >
              <div className="absolute inset-0 rounded-full blur-xl bg-[#C9A84C]/20" />
              <div
                className="w-[120px] h-[120px] rounded-full flex items-center justify-center overflow-hidden border-2 border-[#C9A84C]"
                style={{ position: 'relative' }}
              >
                <Image src="/logo.png" alt="Al-NOOR Academy" fill className="object-contain" priority />
              </div>
            </motion.div>

            {/* Academy Name */}
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#F5FDF8] text-xl md:text-2xl font-bold text-center font-brand mb-1"
            >
              Al-NOOR Online Quran
            </motion.h1>

            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-[#C9A84C] text-base md:text-lg font-brand text-center mb-4"
            >
              & Hadees Academy
            </motion.h2>

            {/* Loading Dots */}
            <motion.div className="flex gap-1.5">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: index * 0.15 }}
                />
              ))}
            </motion.div>

            {/* Click to skip hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1 }}
              className="absolute bottom-8 text-white/50 text-xs"
            >
              Click to skip
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
