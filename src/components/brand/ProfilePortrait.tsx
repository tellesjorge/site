import { useState } from 'react'
import heroCutoutImg from '../../assets/profile/jorge-telles-hero-cutout.png'
import profileImg from '../../assets/profile/jorge-telles-profile.png'
import avatarImg from '../../assets/profile/jorge-telles-avatar.png'
import consultingImg from '../../assets/profile/jorge-telles-consulting.png'

const variantImages = {
  hero: heroCutoutImg,
  profile: profileImg,
  avatar: avatarImg,
  consulting: consultingImg,
  wide: consultingImg
}

type ProfilePortraitProps = {
  variant: 'hero' | 'profile' | 'avatar' | 'consulting' | 'wide'
  alt?: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'wide'
}

export default function ProfilePortrait({
  variant,
  alt,
  className = '',
  size = 'md'
}: ProfilePortraitProps) {
  const [hasError, setHasError] = useState(false)

  const sizeClasses = {
    sm: 'w-20 h-20 text-xl rounded-2xl',
    md: 'w-48 h-48 text-4xl rounded-[32px] sm:w-56 sm:h-56',
    lg: 'w-72 h-72 text-6xl rounded-[40px] md:w-80 md:h-80 lg:w-96 lg:h-96',
    wide: 'w-full h-48 sm:h-64 md:h-80 rounded-[32px]'
  }

  const defaultAlt = {
    hero: 'Jorge Telles, Controller Estratégico especialista em Controladoria, FP&A e IA Financeira',
    profile: 'Jorge Telles em retrato executivo profissional',
    avatar: 'Jorge Telles em foto profissional executiva',
    consulting: 'Jorge Telles em contexto de consultoria e análise financeira',
    wide: 'Jorge Telles atuando em consultoria e planejamento de controladoria'
  }

  const selectedImg = variantImages[variant]
  const fitClass = variant === 'hero' ? 'object-contain' : 'object-cover'
  const sizeClass = variant === 'hero' ? '' : sizeClasses[size]

  if (hasError || !selectedImg) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0071e3] via-[#4db7ff] to-[#1fb6ff] font-bold text-[#fff] shadow-xl border border-white/45 ${sizeClass || sizeClasses[size]} ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_rgba(255,255,255,0.32),_transparent_58%)]" />
        <span className="relative tracking-wider select-none">JT</span>
      </div>
    )
  }

  return (
    <img
      src={selectedImg}
      alt={alt || defaultAlt[variant]}
      onError={() => setHasError(true)}
      loading={variant === 'hero' ? 'eager' : 'lazy'}
      decoding="async"
      className={`${fitClass} ${sizeClass} ${className}`}
    />
  )
}
