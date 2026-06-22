import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2600);
    const t2 = setTimeout(onDone, 3200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.h1
            className="text-2xl md:text-4xl font-black tracking-[0.3em] text-black"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            LIVE LEAKS!!!!
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
