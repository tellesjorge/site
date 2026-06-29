import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Smartphone, Linkedin } from 'lucide-react'
import { profile } from '../data/profile'
import { useLanguage } from '../context/LanguageContext'

function Contact() {
  const { language, t } = useLanguage()
  const [consent, setConsent] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handlePrimaryAction = () => {
    if (!consent) {
      setShowHint(true)
      setShowConfirmation(false)
      return
    }

    setShowHint(false)
    setShowConfirmation(true)
  }

  const whatsappUrl = language === 'en' ? profile.actions.whatsappEn : profile.actions.whatsapp

  return (
    <motion.section
      id="contato"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="mb-20 rounded-[32px] border border-black/5 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
    >
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[#0071e3]">
            {t({ pt: 'Contato', en: 'Contact' })}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
            {t(profile.contact.title)}
          </h2>
          <div className="mt-4 rounded-[24px] border border-[#0071e3]/10 bg-[#f7faff] p-4 text-sm text-[#1d1d1f]">
            <p className="font-medium">
              {t({
                pt: 'Se você chegou até aqui, provavelmente está procurando alguém que transforme números, processos e decisões em resultados claros.',
                en: 'If you made it this far, you are likely looking for someone to bridge datasets, operations, and direct boardroom results.'
              })}
            </p>
            <p className="mt-2 text-[#424245]">
              {t({
                pt: 'Eu ajudo RH, gestores e empresas a encontrar um profissional com visão executiva e presença prática.',
                en: 'I help HR managers, executives, and organizations locate a professional with strategic vision and real-world execution.'
              })}
            </p>
          </div>
          <p className="mt-4 max-w-xl text-[#6e6e73]">
            {t(profile.contact.description)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#34c759]/20 bg-[#34c759]/10 px-5 py-3 text-sm font-medium text-[#1d1d1f] transition hover:bg-[#34c759]/15"
            >
              <Smartphone className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={profile.actions.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#1d1d1f] transition hover:bg-[#f5f5f7]"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href={`mailto:contato@jorgetelles.com.br`}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#1d1d1f] transition hover:bg-[#f5f5f7]"
            >
              <Mail className="h-4 w-4" /> E-mail
            </a>
          </div>
        </div>
        <div className="rounded-[28px] border border-black/5 bg-[#fafafa] p-8 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
          <form className="grid gap-5">
            <label className="space-y-2 text-sm text-[#424245]">
              <span>{t({ pt: 'Nome', en: 'Name' })}</span>
              <input
                type="text"
                placeholder={t({ pt: 'Seu nome', en: 'Your name' })}
                className="w-full rounded-3xl border border-black/10 bg-white px-4 py-3 text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/40 focus:ring-2 focus:ring-[#0071e3]/20"
              />
            </label>
            <label className="space-y-2 text-sm text-[#424245]">
              <span>E-mail</span>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full rounded-3xl border border-black/10 bg-white px-4 py-3 text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/40 focus:ring-2 focus:ring-[#0071e3]/20"
              />
            </label>
            <label className="space-y-2 text-sm text-[#424245]">
              <span>{t({ pt: 'Mensagem', en: 'Message' })}</span>
              <textarea
                rows={5}
                placeholder={t({ pt: 'Fale sobre a oportunidade ou projeto', en: 'Tell me about the position or project scope' })}
                className="w-full rounded-3xl border border-black/10 bg-white px-4 py-3 text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/40 focus:ring-2 focus:ring-[#0071e3]/20"
              />
            </label>
            <label className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-3 text-sm text-[#424245]">
              <input
                type="checkbox"
                checked={consent}
                onChange={() => {
                  setConsent((value) => !value)
                  setShowHint(false)
                  setShowConfirmation(false)
                }}
                className="mt-1 h-4 w-4 rounded border-black/10 bg-white text-[#0071e3] focus:ring-[#0071e3]"
              />
              <span>
                {t({
                  pt: 'Concordo que meus dados sejam usados apenas para responder à minha mensagem e manter o contato profissional.',
                  en: 'I consent to having my data used exclusively to answer this message and establish professional communication.'
                })}{' '}
                <a href="#privacidade" className="text-[#0071e3] underline-offset-2 hover:underline">
                  {t({ pt: 'Saiba mais.', en: 'Read more.' })}
                </a>
              </span>
            </label>
            {showHint && (
              <p className="text-sm text-amber-600">
                {t({ pt: 'Para continuar, confirme sua autorização de uso dos dados.', en: 'To proceed, please check the privacy policy checkbox.' })}
              </p>
            )}
            {showConfirmation && (
              <p className="text-sm text-emerald-600">
                {t({
                  pt: 'Obrigado! Sua mensagem será tratada com transparência e conforme a LGPD.',
                  en: 'Thank you! Your inquiry is safely handled in accordance with GDPR / LGPD laws.'
                })}
              </p>
            )}
            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={!consent}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2997ff] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> {t({ pt: 'Quero conversar', en: 'Let\'s talk' })}
            </button>
            <p className="text-xs text-[#8e8e93]">
              {t({
                pt: 'Este formulário não usa os dados para marketing e não armazena informações além do necessário para responder ao seu contato.',
                en: 'This form does not collect data for newsletter lists or marketing, and stores no details beyond what is required to reply.'
              })}
            </p>
          </form>
        </div>
      </div>
    </motion.section>
  )
}

export default Contact
