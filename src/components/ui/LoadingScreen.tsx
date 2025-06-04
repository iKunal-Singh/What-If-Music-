
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);

  const loadingTexts = [
    "Crafting beats...",
    "Mixing frequencies...",
    "Tuning soundwaves...",
    "Launching BeatWave..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const textTimer = setInterval(() => {
      setCurrentText(prev => (prev + 1) % loadingTexts.length);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, [onComplete]);

  // Generate floating music notes
  const musicNotes = ['♪', '♫', '♬', '♩', '♭', '♯'];
  const floatingNotes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    note: musicNotes[Math.floor(Math.random() * musicNotes.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: 0.5 + Math.random() * 0.8,
    delay: Math.random() * 2,
  }));

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {floatingNotes.map((note) => (
          <motion.div
            key={note.id}
            className="absolute text-beatwave-500/20 text-2xl font-bold select-none"
            style={{
              left: `${note.x}%`,
              top: `${note.y}%`,
              transform: `scale(${note.scale})`,
            }}
            animate={{
              y: [-20, -40, -20],
              rotate: [0, 10, -10, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: note.delay,
              ease: "easeInOut",
            }}
          >
            {note.note}
          </motion.div>
        ))}
      </div>

      {/* Central Loading Animation */}
      <div className="relative z-10 text-center">
        {/* Pulsing Sound Wave Visualization */}
        <motion.div 
          className="flex items-end justify-center mb-8 h-20"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {Array.from({ length: 7 }, (_, i) => (
            <motion.div
              key={i}
              className="w-2 mx-1 bg-gradient-to-t from-beatwave-600 to-beatwave-400 rounded-full"
              animate={{
                height: [10, 60, 20, 50, 15, 40, 25][i],
                scaleY: [0.5, 1.5, 0.8, 1.2, 0.6, 1.3, 0.9],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="mb-6"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-beatwave-400 via-purple-500 to-beatwave-600 bg-clip-text text-transparent">
            BeatWave
          </h1>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          className="mb-6 h-6"
          key={currentText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-white/80 text-lg font-medium">
            {loadingTexts[currentText]}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-beatwave-500 to-purple-500 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Progress Percentage */}
        <motion.p 
          className="text-white/60 text-sm mt-3 font-mono"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {progress}%
        </motion.p>
      </div>

      {/* Corner Elements */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 border-2 border-beatwave-500/30 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-16 h-16 border-2 border-purple-500/30 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

export default LoadingScreen;
