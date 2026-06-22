import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2600;
    const id = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(p);
      if (p >= 100) clearInterval(id);
    }, 30);
    const t = setTimeout(() => setVisible(false), duration + 200);
    const t2 = setTimeout(onDone, duration + 800);
    return () => {
      clearInterval(id);
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.h1
            className="text-2xl md:text-4xl font-extrabold tracking-[0.3em] text-black"
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            LIVE LEAKS!!!!
          </motion.h1>

          <div className="mt-8 w-[220px] sm:w-[300px] h-[3px] bg-black/10 overflow-hidden">
            <motion.div
              className="h-full bg-black"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <motion.p
            className="mt-3 text-[10px] font-mono tracking-[0.3em] text-black/60 uppercase"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            cargando drop
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
