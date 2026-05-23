import { useEffect, useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-gradient-to-b from-sky-100 via-white to-sky-100/60 p-8 select-none">
      {/* Decorative top pattern */}
      <div className="w-full flex justify-between items-center text-slate-400">
        <Sparkles size={16} className="text-sky-400 animate-pulse" />
        <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">v1.2 Premium Edition</span>
        <Sparkles size={14} className="text-teal-400 animate-pulse delay-75" />
      </div>

      {/* Main Illustration and branding container */}
      <div className="flex flex-col items-center justify-center gap-6 my-auto">
        <motion.div
          initial={{ scale: 0.8, rotate: -15, opacity: 0 }}
          animate={{ scale: [1, 1.05, 1], rotate: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-28 h-28 bg-gradient-to-tr from-cyan-400 to-teal-600 rounded-3xl flex items-center justify-center shadow-lg shadow-teal-100"
        >
          {/* Backing paper effects */}
          <div className="absolute inset-1 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm"></div>
          <BookOpen size={56} className="text-white relative z-10 filter drop-shadow" />
          
          {/* Sparkle decorative circles */}
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow animate-bounce">
            ★
          </div>
        </motion.div>

        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-sans font-extrabold tracking-tight text-slate-800"
          >
            Book<span className="text-teal-600">Verse</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-slate-500 font-medium tracking-wide mt-2"
          >
            Discover Your Next Favorite Book
          </motion.p>
        </div>
      </div>

      {/* Progress & Bottom Tag line */}
      <div className="w-full flex flex-col items-center gap-4 mt-auto">
        {/* Progress Bar Container */}
        <div className="w-48 h-1.5 bg-slate-200/80 rounded-full overflow-hidden backdrop-blur-sm self-center">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
          Loading Library {progress}%
        </span>
      </div>
    </div>
  );
}
