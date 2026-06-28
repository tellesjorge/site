import { useEffect, useState } from 'react'
import { ShieldCheck, X } from 'lucide-react'

const STORAGE_KEY = 'jorge-privacy-consent'
type ConsentState = 'accepted' | 'declined' | 'pending'

function PrivacyBanner() {
  const [consent, setConsent] = useState<ConsentState>('pending')

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'accepted' || saved === 'declined') {
      setConsent(saved)
    }
  }, [])

  const saveConsent = (value: ConsentState) => {
    setConsent(value)
    window.localStorage.setItem(STORAGE_KEY, value)
  }

  if (consent !== 'pending') {
    return null
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-6xl rounded-[24px] border border-black/10 bg-white/95 p-4 shadow-2xl backdrop-blur-xl sm:inset-x-6 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          <div className="mt-0.5 rounded-2xl bg-[#0071e3]/10 p-2 text-[#0071e3] flex-shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1d1d1f]">Este site respeita a LGPD</p>
            <p className="mt-1 max-w-2xl text-xs text-[#6e6e73] leading-relaxed">
              Usamos apenas armazenamento local para lembrar sua escolha de consentimento. Não utilizamos cookies de marketing ou rastreamento para fins comerciais.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => saveConsent('declined')}
            className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-[#424245] transition hover:bg-slate-100"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => saveConsent('accepted')}
            className="rounded-full bg-[#0071e3] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2997ff]"
          >
            Aceitar
          </button>
          <a
            href="#privacidade"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-[#424245] transition hover:bg-slate-100"
          >
            Política
          </a>
        </div>
      </div>
    </div>
  )
}

export default PrivacyBanner
