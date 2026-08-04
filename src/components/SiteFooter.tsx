import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { CONTACT, waLink } from "@/lib/drop-data";

export default function SiteFooter() {
  return (
    <footer className="bg-white text-black border-t border-black/10 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs tracking-[0.3em] uppercase">© LIVE LEAKS by INTI(t)</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            to="/pagos"
            className="text-xs tracking-[0.3em] uppercase underline underline-offset-4 hover:opacity-60"
          >
            Pagos y envíos
          </Link>
          <Link
            to="/terminos"
            className="text-xs tracking-[0.3em] uppercase underline underline-offset-4 hover:opacity-60"
          >
            Términos y condiciones
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <SocialLink href={CONTACT.instagram} label="Instagram">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </SocialLink>
          <SocialLink href={waLink()} label="WhatsApp">
            <svg viewBox="0 0 32 32" className="w-5 h-5" fill="currentColor" aria-hidden="true">
              <path d="M16.003 3C9.374 3 4 8.373 4 15.002c0 2.29.638 4.503 1.848 6.428L4 29l7.75-1.816a12.02 12.02 0 0 0 4.252.78h.005C22.634 27.964 28 22.591 28 15.962 28 12.75 26.75 9.73 24.48 7.46A11.94 11.94 0 0 0 16.003 3Zm0 21.75h-.004a9.97 9.97 0 0 1-5.077-1.39l-.365-.216-4.6 1.078 1.098-4.487-.238-.377a9.97 9.97 0 0 1-1.529-5.356c0-5.51 4.487-9.997 10.005-9.997 2.673 0 5.186 1.041 7.076 2.932a9.94 9.94 0 0 1 2.928 7.073c0 5.518-4.487 10.74-9.294 10.74Zm5.48-7.49c-.3-.15-1.774-.876-2.05-.976-.275-.1-.475-.15-.674.15-.2.3-.775.976-.95 1.176-.174.2-.35.225-.65.075-.3-.15-1.266-.467-2.412-1.488-.892-.795-1.494-1.777-1.669-2.077-.174-.3-.019-.462.131-.611.135-.135.3-.35.45-.525.15-.174.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.674-1.625-.924-2.225-.244-.585-.492-.505-.674-.514l-.575-.011c-.2 0-.525.075-.8.375-.275.3-1.05 1.026-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.115 3.23 5.126 4.53.717.31 1.276.494 1.712.632.72.229 1.375.197 1.893.12.578-.086 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35Z" />
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
