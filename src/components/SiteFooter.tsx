import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { CONTACT } from "@/lib/drop-data";
import { WompiBancolombiaLogos } from "@/components/TrustBadges";

export default function SiteFooter() {
  return (
    <footer className="bg-black text-white border-t border-white/10 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="micro">© LIVE LEAKS by INTI(t)</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              to="/pagos"
              className="micro underline underline-offset-4 hover:opacity-60"
            >
              Pagos y envíos
            </Link>
            <Link
              to="/terminos"
              className="micro underline underline-offset-4 hover:opacity-60"
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
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex justify-center md:justify-start">
          <WompiBancolombiaLogos />
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
      className="w-11 h-11 flex items-center justify-center hairline text-white hover:bg-white hover:text-black transition-colors duration-300"
    >
      {children}
    </motion.a>
  );
}
