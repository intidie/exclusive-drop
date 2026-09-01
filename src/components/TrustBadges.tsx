// Insignias de confianza: se usan cerca del botón de pago y en el footer.
// Requiere que /public/images/wompi-white.png y
// /public/images/bancolombia-white.png existan en el proyecto (logos
// oficiales, fondo transparente, en blanco para verse bien sobre fondo
// negro).
export function WompiVerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/images/wompi-white.png" alt="Wompi" className="h-4 w-auto opacity-90" />
      <span className="text-[10px] tracking-[0.15em] uppercase text-white/60">
        Verificado por Bancolombia
      </span>
    </div>
  );
}

export function WompiBancolombiaLogos({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <p className="text-[10px] tracking-[0.15em] uppercase text-white/45">
        Wompi es parte del Grupo Bancolombia
      </p>
      <div className="flex items-center gap-5">
        <img src="/images/wompi-white.png" alt="Wompi" className="h-5 w-auto opacity-90" />
        <span className="text-white/20 text-lg leading-none">×</span>
        <img src="/images/bancolombia-white.png" alt="Bancolombia" className="h-4 w-auto opacity-90" />
      </div>
    </div>
  );
}
