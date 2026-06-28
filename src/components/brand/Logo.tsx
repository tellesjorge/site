import { Link } from 'react-router-dom'

type LogoProps = {
  variant?: 'full' | 'compact' | 'mark'
  className?: string
  lightText?: boolean
  onClick?: () => void
}

export default function Logo({ variant = 'full', className = '', lightText = false, onClick }: LogoProps) {
  // Subtle trendline/graphic details matching financial decisions
  const sparkIcon = (
    <svg
      className="h-4.5 w-4.5 text-[#0071e3]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="m18 8-5 5-4-4-4 4" />
    </svg>
  )

  const titleColor = lightText ? 'text-white' : 'text-[#1d1d1f]'
  const subtitleColor = lightText ? 'text-slate-300' : 'text-[#6e6e73]'

  if (variant === 'mark') {
    return (
      <Link to="/" onClick={onClick} className={`inline-flex items-center justify-center hover:opacity-85 transition ${className}`}>
        <div className="rounded-xl bg-[#0071e3]/10 p-2 flex items-center justify-center border border-[#0071e3]/15">
          {sparkIcon}
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link to="/" onClick={onClick} className={`inline-flex items-center gap-2 font-bold tracking-tight ${titleColor} hover:opacity-85 transition ${className}`}>
        <div className="rounded-lg bg-[#0071e3]/10 p-1.5 flex items-center justify-center">
          {sparkIcon}
        </div>
        <span className="text-base tracking-wider">JT</span>
      </Link>
    )
  }

  return (
    <Link to="/" onClick={onClick} className={`inline-flex items-center gap-3 hover:opacity-90 transition ${className}`}>
      <div className="rounded-xl bg-[#0071e3]/10 p-2 flex items-center justify-center">
        {sparkIcon}
      </div>
      <div className="flex flex-col text-left">
        <span className={`text-sm font-bold tracking-wider leading-tight ${titleColor}`}>
          Jorge Telles
        </span>
        <span className={`text-[9px] font-semibold uppercase tracking-widest ${subtitleColor} mt-0.5`}>
          Controladoria • FP&A • IA Financeira
        </span>
      </div>
    </Link>
  )
}
