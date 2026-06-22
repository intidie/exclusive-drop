import { motion } from "motion/react";
import { CONTACT, waLink } from "@/lib/drop-data";

export default function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="w-12 h-12 flex items-center justify-center bg-black text-white border border-black hover:bg-white hover:text-black transition-colors duration-300"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M20.5 3.5A11 11 0 0 0 3.2 17.3L2 22l4.8-1.2A11 11 0 1 0 20.5 3.5Zm-3.5 10.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2s-.8.9-1 1.1-.4.2-.7 0a7.4 7.4 0 0 1-2.2-1.3 8.3 8.3 0 0 1-1.5-1.9c-.2-.3 0-.5.1-.6l.5-.5.3-.5a.5.5 0 0 0 0-.5l-.7-1.7c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.3c0 1.4 1 2.7 1.2 2.9s2.1 3.2 5 4.5a17 17 0 0 0 1.7.6 4 4 0 0 0 1.8.1 3 3 0 0 0 2-1.4 2.4 2.4 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3Z" />
        </svg>
      </motion.a>
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.6 }}
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
