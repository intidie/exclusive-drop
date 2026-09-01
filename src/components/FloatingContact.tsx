import { motion } from "motion/react";
import { CONTACT } from "@/lib/drop-data";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        href={CONTACT.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="w-12 h-12 flex items-center justify-center bg-white text-black border border-black hover:bg-black hover:text-white transition-colors duration-300"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      </motion.a>
    </div>
  );
}
