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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 backdrop-blur-xl p-4">
      <div className="w-full max-w-md rounded-[32px] border border-black/5 bg-white p-8 shadow-2xl space-y-6 text-center flex flex-col items-center">
        {/* Premium Shield Icon */}
        <div className="rounded-[24px] bg-[#0071e3]/10 p-4 text-[#0071e3] flex-shrink-0">
          <ShieldCheck className="h-8 w-8" />
        </div>
        
        <div className="space-y-2.5">
          <h3 className="text-lg font-bold text-[#1d1d1f]">Conformidade Legal & LGPD</h3>
          <p className="text-xs text-[#6e6e73] leading-relaxed">
            Em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/18)</strong>, solicitamos seu consentimento para prosseguir. 
            Este site utiliza armazenamento local estritamente necessário para fins de navegação e propostas. Não utilizamos cookies de rastreamento comercial.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 pt-2">
          <button
            type="button"
            onClick={handleAccept}
            className="w-full rounded-full bg-[#0071e3] py-3 text-xs font-semibold text-white transition hover:bg-[#2997ff] active:scale-[0.98] shadow-sm"
          >
            Sim, concordo e desejo continuar
          </button>
          
          <a
            href="#privacidade"
            onClick={handleAccept}
            className="text-[11px] font-bold text-[#8e8e93] hover:text-[#1d1d1f] hover:underline transition"
          >
            Ler Política de Privacidade completa
          </a>
        </div>
      </div>
    </div>
  )
}

export default PrivacyBanner
