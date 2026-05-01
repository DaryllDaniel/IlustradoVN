import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LocationIntroProps {
  title: string;
  location: string;
  onComplete: () => void;
}

export function LocationIntro({ title, location, onComplete }: LocationIntroProps) {
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Allow clicking after a brief delay so they see the art
    const timer = setTimeout(() => {
      setCanSkip(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-b from-black/50 via-black/10 to-black/50 backdrop-blur-[1px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onClick={() => {
        if (canSkip) onComplete();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
        className="text-center px-4 max-w-4xl"
      >
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
          className="h-px bg-amber-500/60 mx-auto mb-6"
        />
        <h2 className="text-xl md:text-2xl text-amber-400 font-serif tracking-[0.3em] mb-4 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {title}
        </h2>
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold font-serif drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] leading-tight">
          {location}
        </h1>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
          className="h-px bg-amber-500/60 mx-auto mt-6"
        />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: canSkip ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-16 text-white/80 text-sm tracking-[0.2em] uppercase animate-pulse"
      >
        Click to begin
      </motion.p>
    </motion.div>
  );
}
