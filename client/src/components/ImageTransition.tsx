import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ImageTransitionProps {
  imageUrl: string;
  onComplete: () => void;
}

export function ImageTransition({ imageUrl, onComplete }: ImageTransitionProps) {
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Allow clicking after a brief delay to view the image
    const timer = setTimeout(() => {
      setCanSkip(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex items-center justify-center cursor-pointer bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onClick={() => {
        if (canSkip) onComplete();
      }}
    >
      <motion.img
        src={imageUrl}
        alt="Transition"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full h-full object-cover"
      />
      {canSkip && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Click to continue
        </motion.div>
      )}
    </motion.div>
  );
}
