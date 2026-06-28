import ProfilePortrait from './ProfilePortrait'

export default function HeroImageAtmosphere() {
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center">
      {/* Layer 5/1: Ambient glow behind the container */}
      <div className="absolute inset-[-20px] z-0 rounded-[64px] bg-gradient-to-tr from-[#0071e3]/15 via-cyan-500/10 to-transparent blur-[40px] opacity-75 pointer-events-none" />
      <div className="absolute inset-[-5px] z-0 rounded-[52px] bg-gradient-to-b from-blue-500/5 to-cyan-500/5 blur-xl pointer-events-none" />

      {/* Layer 4: Deep ambient box shadows & frame container */}
      <div className="relative z-10 w-full overflow-hidden rounded-[48px] border border-black/5 p-2 bg-gradient-to-b from-[#121214] to-[#1a1a1e] shadow-[0_32px_64px_rgba(0,0,0,0.16)] group">
        
        {/* Internal Backdrop Gradient behind the photo */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(0,113,227,0.15),_transparent_80%)] pointer-events-none" />

        {/* Layer 2: Main Image (cover aspect) */}
        <ProfilePortrait
          variant="hero"
          size="lg"
          className="w-full h-[400px] sm:h-[480px] md:h-[520px] lg:h-[540px] rounded-[40px] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
        />

        {/* Layer 3: Fade overlay at the bottom and edge borders for environmental blend */}
        <div className="absolute inset-x-2 bottom-2 h-36 bg-gradient-to-t from-[#121214] via-[#121214]/65 to-transparent pointer-events-none rounded-b-[40px]" />
        
        <div className="absolute inset-2 pointer-events-none rounded-[40px] border border-white/10" />

        {/* Overlay metadata */}
        <div className="absolute bottom-6 left-8 right-8 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Sessão Segura</span>
          </div>
          <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">Curitiba, PR</span>
        </div>
      </div>
    </div>
  )
}
