import { useEffect, useState } from "react";

const KEY = "intit_discount_deadline_v1";
const DURATION_MS = 8 * 60 * 60 * 1000;

function getDeadline(): number {
  if (typeof window === "undefined") return Date.now() + DURATION_MS;
  const raw = window.localStorage.getItem(KEY);
  const parsed = raw ? parseInt(raw, 10) : NaN;
  if (!raw || Number.isNaN(parsed) || parsed < Date.now()) {
    const d = Date.now() + DURATION_MS;
    window.localStorage.setItem(KEY, String(d));
    return d;
  }
  return parsed;
}

export default function CountdownTimer() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining === null) return null;

  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase font-mono bg-black text-white px-2 py-0.5">
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}
