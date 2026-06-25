import { motion } from "motion/react";
import { CONTACT, waLink } from "@/lib/drop-data";

export default function SiteFooter() {
  return (
    <footer className="bg-white text-black border-t border-black/10 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs tracking-[0.3em] uppercase">© LIVE LEAKS by INTI(t)</p>
        <a
          href="#terms"
          className="text-xs tracking-[0.3em] uppercase underline underline-offset-4 hover:opacity-60"
        >
          Términos y condiciones
        </a>
        <div className="flex items-center gap-3">
          <SocialLink href={CONTACT.instagram} label="Instagram">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </SocialLink>
          <SocialLink href={waLink()} label="WhatsApp">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M20.5 3.5A11 11 0 0 0 3.2 17.3L2 22l4.8-1.2A11 11 0 1 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.8.7.8-2.7-.2-.3A9 9 0 1 1 12 20.5Zm5-6.6c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2s-.8.9-1 1.1-.4.2-.7 0a7.4 7.4 0 0 1-2.2-1.3 8.3 8.3 0 0 1-1.5-1.9c-.2-.3 0-.5.1-.6l.5-.5.3-.5a.5.5 0 0 0 0-.5l-.7-1.7c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.3c0 1.4 1 2.7 1.2 2.9s2.1 3.2 5 4.5a17 17 0 0 0 1.7.6 4 4 0 0 0 1.8.1 3 3 0 0 0 2-1.4 2.4 2.4 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3Z" />
            </svg>
          </SocialLink>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-11 h-11 flex items-center justify-center border border-black text-black hover:bg-black hover:text-white transition-colors duration-300"
    >
      {children}
    </motion.a>
  );
}
