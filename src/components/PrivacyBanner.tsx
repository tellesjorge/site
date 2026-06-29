import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'

const STORAGE_KEY = 'jorge-privacy-consent'
type ConsentState = 'accepted' | 'pending'

function PrivacyBanner() {
  const [consent, setConsent] = useState<ConsentState>('pending')

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'accepted') {
      setConsent('accepted')
    }
  }, [])

  const handleAccept = () => {
    setConsent('accepted')
    window.localStorage.setItem(STORAGE_KEY, 'accepted')
  }

  if (consent !== 'pending') {
    return null
  }

  return (
    <div className="fixed top-6 inset-x-4 z-[9999] mx-auto max-w-4xl rounded-[24px] border border-black/10 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.15)] backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3">
          <div className="mt-0.5 rounded-2xl bg-[#0071e3]/10 p-2 text-[#0071e3] flex-shrink-0 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1d1d1f]">Conformidade LGPD & Privacidade</p>
            <p className="mt-0.5 text-xs text-[#6e6e73] leading-relaxed">
              Solicitamos seu consentimento para prosseguir. Utilizamos armazenamento local estritamente necessário para fins de navegação e propostas, sem cookies de rastreamento comercial.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 flex-shrink-0">
          <a
            href="#privacidade"
            onClick={handleAccept}
            className="text-[11px] font-bold text-[#8e8e93] hover:text-[#1d1d1f] hover:underline transition"
          >
            Ler Política
          </a>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-full bg-[#0071e3] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2997ff] active:scale-[0.98]"
          >
            Sim, concordo
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivacyBanner
