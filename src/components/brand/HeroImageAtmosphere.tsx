import ProfilePortrait from './ProfilePortrait'

export default function HeroImageAtmosphere() {
  return (
    <div className="relative mx-auto flex w-full max-w-[520px] items-center justify-center lg:mx-0">
      {/* Glow ambiental branco/azul/ciano suave atrás da foto */}
      <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle_at_50%_50%,_rgba(0,122,255,0.15),_rgba(0,199,190,0.12)_45%,_transparent_70%)] blur-[60px]" />
      <div className="absolute top-[10%] left-[10%] -z-10 h-[300px] w-[300px] rounded-full bg-sky-200/30 blur-[80px]" />
      <div className="absolute bottom-[20%] right-[10%] -z-10 h-[280px] w-[280px] rounded-full bg-cyan-200/25 blur-[80px]" />

      {/* Sombra difusa elegante abaixo da pessoa */}
      <div className="absolute bottom-[-15px] left-1/2 -z-10 h-10 w-[72%] -translate-x-1/2 rounded-full bg-slate-900/6 blur-[24px]" />

      {/* Formas translúcidas de profundidade leve */}
      <div className="absolute top-[20%] left-[-15%] -z-10 h-[140px] w-[140px] rounded-full border border-white/60 bg-white/30 shadow-[0_8px_32px_rgba(15,23,42,0.03)] backdrop-blur-md" />
      <div className="absolute bottom-[25%] right-[-12%] -z-10 h-[100px] w-[100px] rounded-full border border-white/70 bg-white/40 shadow-[0_8px_32px_rgba(15,23,42,0.02)] backdrop-blur-sm" />

      {/* Foto recortada transparente flutuando no stage */}
      <ProfilePortrait
        variant="hero"
        className="relative z-10 h-[420px] w-auto object-contain sm:h-[480px] md:h-[540px] lg:h-[610px] select-none"
      />
    </div>
  )
}
