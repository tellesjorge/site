import PageTransition from '../components/layout/PageTransition'
import Skills from '../components/Skills'
import TechStack from '../components/TechStack'
import ResumeDownload from '../components/ResumeDownload'
import Logo from '../components/brand/Logo'
import ProfilePortrait from '../components/brand/ProfilePortrait'
import { profile } from '../data/profile'
import { Linkedin, MessageSquare, Briefcase, GraduationCap } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useLanguage } from '../context/LanguageContext'

export default function ResumePage() {
  const { language, t } = useLanguage()

  useSEO({
    title: t({ pt: 'Currículo Profissional', en: 'Professional Resume' }),
    description: t({
      pt: 'Visualização completa do currículo de Jorge Telles. Formação acadêmica, stack tecnológica (SAP, Power BI, Python) e principais competências em finanças.',
      en: 'Complete professional resume of Jorge Telles. Academic background, tech stack (SAP, Power BI, Python) and core finance competencies.'
    })
  })

  const whatsappUrl = language === 'en' ? profile.actions.whatsappEn : profile.actions.whatsapp

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-black/5 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <ProfilePortrait variant="avatar" size="sm" className="rounded-full shadow-sm" />
            <div>
              <Logo variant="full" />
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0071e3] mt-2">
                {t({ pt: 'Currículo Executivo', en: 'Executive Resume' })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={profile.actions.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-semibold text-[#1d1d1f] hover:bg-slate-50 transition"
            >
              <Linkedin className="h-4 w-4 text-[#0071e3]" /> LinkedIn
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#20ba56] transition"
            >
              <MessageSquare className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>

        {/* Digital Executive CV Layout */}
        <div className="grid gap-12 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Executive Summary */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2 border-b border-black/5 pb-3">
                <Briefcase className="h-5 w-5 text-[#0071e3]" /> {t({ pt: 'Resumo Profissional', en: 'Executive Summary' })}
              </h2>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {t(profile.subtitle)}
              </p>
            </div>

            {/* Experience Summary */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#1d1d1f] border-b border-black/5 pb-3">
                {t({ pt: 'Histórico Profissional', en: 'Professional History' })}
              </h2>
              <div className="space-y-6">
                {profile.experience.map((exp, index) => {
                  const roleStr = t(exp.role)
                  const highlightList = exp.highlights[language] || exp.highlights['pt'] || []
                  return (
                    <div key={index} className="space-y-2 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-bold text-sm text-[#1d1d1f]">{roleStr}</h3>
                        <span className="text-xs text-[#6e6e73] bg-slate-100 px-3 py-1 rounded-full">{t(exp.period)}</span>
                      </div>
                      <p className="text-xs font-semibold text-[#0071e3]">{exp.company}</p>
                      <p className="text-xs text-[#6e6e73] leading-relaxed">{t(exp.summary)}</p>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-[#424245]">
                        {highlightList.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Formation / Certifications */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2 border-b border-black/5 pb-3">
                <GraduationCap className="h-5 w-5 text-[#0071e3]" /> {t({ pt: 'Formação Acadêmica', en: 'Academic Background' })}
              </h2>
              <div className="space-y-3 text-xs text-[#6e6e73]">
                <p>
                  <strong>{t({ pt: 'Bacharelado em Ciências Contábeis', en: 'Bachelor of Science in Accounting' })}</strong>
                </p>
                <p>
                  {t({
                    pt: 'CRC ativo e regularizado pronto para atuação em controladoria corporativa.',
                    en: 'Active, regularized CRC (Certified Public Accountant) credentials ready for controllership service.'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-10 rounded-[32px] border border-black/5 bg-slate-50 p-6 lg:p-8">
            <Skills />
            <TechStack />
            <div className="pt-4 border-t border-black/5">
              <ResumeDownload />
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
