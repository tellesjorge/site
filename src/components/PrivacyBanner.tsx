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
    <div className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-6xl rounded-[24px] border border-cyan-400/20 bg-slate-950/95 p-4 shadow-glass backdrop-blur-xl sm:inset-x-6 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-3">
          <div className="mt-0.5 rounded-2xl bg-cyan-500/10 p-2 text-cyan-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Este site respeita a LGPD</p>
            <p className="mt-1 max-w-2xl text-sm text-slate-300">
              Usamos apenas armazenamento local para lembrar sua escolha de consentimento. Não utilizamos cookies de marketing ou rastreamento para fins comerciais.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => saveConsent('declined')}
            className="rounded-full border border-slate-700/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => saveConsent('accepted')}
            className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Aceitar
          </button>
          <a
            href="#privacidade"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Política
          </a>
        </div>
      </div>
    </div>
  )
}

export default PrivacyBanner
