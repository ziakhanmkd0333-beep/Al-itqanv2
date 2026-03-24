"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at center, #0D4D2F 0%, #071410 100%)"
          }}
        >
          {/* Islamic Geometric Pattern - Rotating */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <svg
              width="800"
              height="800"
              viewBox="0 0 200 200"
              className="opacity-20"
              style={{ filter: "drop-shadow(0 0 20px rgba(201, 168, 76, 0.3))" }}
            >
              {/* Hexagonal Islamic Pattern */}
              <defs>
                <pattern id="islamic-hex" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M20 0L40 10L40 30L20 40L0 30L0 10Z"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M20 5L35 12.5L35 27.5L20 35L5 27.5L5 12.5Z"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="0.3"
                  />
                </pattern>
              </defs>
              <rect width="200" height="200" fill="url(#islamic-hex)" />
            </svg>
          </motion.div>

          {/* Concentric Gold Rings with Pulse Animation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                className="absolute rounded-full border-2 border-[#C9A84C]"
                style={{
                  width: `${280 + index * 60}px`,
                  height: `${280 + index * 60}px`,
                  boxShadow: "0 0 30px rgba(201, 168, 76, 0.2)"
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.4,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Central Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Bismillah at top */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-8"
            >
              <p className="arabic-text text-[#C9A84C] text-xl md:text-2xl opacity-80">
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
            </motion.div>

            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-8"
              style={{ position: 'relative', height: '140px', width: '140px' }}
            >
              {/* Outer Glow */}
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{
                  background: "radial-gradient(circle, rgba(201, 168, 76, 0.4) 0%, transparent 70%)",
                  transform: "scale(1.5)"
                }}
              />

              {/* Logo Circle */}
              <div
                className="w-[140px] h-[140px] rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  position: 'relative',
                  border: "3px solid #C9A84C",
                  boxShadow: "0 0 60px rgba(201, 168, 76, 0.4), 0 0 120px rgba(26, 122, 74, 0.3), inset 0 0 30px rgba(201, 168, 76, 0.1)"
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Al-NOOR Academy"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Academy Name */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-[#F5FDF8] text-2xl md:text-3xl font-bold text-center font-brand mb-2"
              style={{
                textShadow: "0 0 30px rgba(201, 168, 76, 0.3)"
              }}
            >
              Al-NOOR Online Quran
            </motion.h1>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="text-[#C9A84C] text-lg md:text-xl font-brand text-center mb-6"
            >
              & Hadees Academy
            </motion.h2>

            {/* Tagline */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              className="text-[#A8C9B5] text-sm md:text-base text-center max-w-md px-4"
            >
              World's First Complete Islamic Knowledge Web App
            </motion.p>

            {/* Loading Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex gap-2 mt-8"
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 rounded-full bg-[#C9A84C]"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
              ))}
            </motion.div>

            {/* Islamic Decoration Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-6 h-[1px] w-32 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
