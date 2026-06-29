import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageTransition from '../components/layout/PageTransition'
import ProfilePortrait from '../components/brand/ProfilePortrait'
import { profile } from '../data/profile'
import { Send, Smartphone, Linkedin, Mail, CheckCircle2, Download } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useLanguage } from '../context/LanguageContext'

export default function ContactPage() {
  const { language, t } = useLanguage()

  useSEO({
    title: t({ pt: 'Contato & Propostas', en: 'Contact & Proposals' }),
    description: t({
      pt: 'Inicie uma conversa estratégica para contratação executiva ou consultoria com Jorge Telles. Fale direto pelo WhatsApp ou envie sua proposta.',
      en: 'Initiate a strategic conversation for executive hire or consulting with Jorge Telles. Reach out on WhatsApp or send a proposal.'
    })
  })

  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('interest') === 'consulting' ? 'consulting' : 'hire'
  const [activeTab, setActiveTab] = useState<'hire' | 'consulting'>(initialTab)

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    whatsapp: '',
    interestType: '',
    message: ''
  })
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const interest = searchParams.get('interest')
    if (interest === 'consulting') {
      setActiveTab('consulting')
    } else if (interest === 'hire') {
      setActiveTab('hire')
    }
  }, [searchParams])

  const getWhatsAppFallbackLink = () => {
    const isEn = language === 'en'
    const intro = isEn 
      ? `Hello Jorge,\n\nMy name is *${formData.name}*${formData.company ? ` from company *${formData.company}*` : ''}.\n` +
        `I am reaching out regarding: *${activeTab === 'hire' ? 'Professional Opportunity' : 'Corporate Consulting'} (${formData.interestType || 'General'})*.\n\n` +
        `*Message:*\n${formData.message}\n\n` +
        `*Email:* ${formData.email}\n` +
        `*WhatsApp:* ${formData.whatsapp || 'Not provided'}`
      : `Olá Jorge,\n\nMe chamo *${formData.name}*${formData.company ? ` da empresa *${formData.company}*` : ''}.\n` +
        `Estou entrando em contato sobre: *${activeTab === 'hire' ? 'Oportunidade Profissional' : 'Consultoria Empresarial'} (${formData.interestType || 'Geral'})*.\n\n` +
        `*Mensagem:*\n${formData.message}\n\n` +
        `*E-mail:* ${formData.email}\n` +
        `*WhatsApp:* ${formData.whatsapp || 'Não informado'}`
    return `https://wa.me/5541920056796?text=${encodeURIComponent(intro)}`
  }

  const getMailtoFallbackLink = () => {
    const isEn = language === 'en'
    const subject = encodeURIComponent(
      isEn 
        ? `Portfolio Lead: [${activeTab === 'hire' ? 'Job' : 'Consulting'}] ${formData.name}`
        : `Lead Portfólio: [${activeTab === 'hire' ? 'Vaga' : 'Consultoria'}] ${formData.name}`
    )
    const body = encodeURIComponent(
      isEn
        ? `Hello Jorge Telles,\n\n` +
          `Name: ${formData.name}\n` +
          `Company: ${formData.company || 'Not provided'}\n` +
          `Email: ${formData.email}\n` +
          `WhatsApp/Phone: ${formData.whatsapp || 'Not provided'}\n` +
          `Interest: ${activeTab === 'hire' ? 'Professional Opportunity' : 'Corporate Consulting'} (${formData.interestType || 'General'})\n\n` +
          `Message:\n${formData.message}`
        : `Olá Jorge Telles,\n\n` +
          `Nome: ${formData.name}\n` +
          `Empresa: ${formData.company || 'Não informado'}\n` +
          `E-mail: ${formData.email}\n` +
          `WhatsApp/Telefone: ${formData.whatsapp || 'Não informado'}\n` +
          `Interesse: ${activeTab === 'hire' ? 'Oportunidade Profissional' : 'Consultoria Empresarial'} (${formData.interestType || 'Geral'})\n\n` +
          `Mensagem:\n${formData.message}`
    )
    return `mailto:telles.jorge@gmail.com?subject=${subject}&body=${body}`
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!consent) {
      setErrorMsg(t({
        pt: 'Você precisa autorizar o tratamento de dados em conformidade com a LGPD.',
        en: 'You must authorize data treatment in compliance with privacy laws (GDPR/LGPD).'
      }))
      return
    }
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg(t({
        pt: 'Por favor, preencha todos os campos obrigatórios.',
        en: 'Please fill in all required fields.'
      }))
      return
    }

    setErrorMsg('')
    setIsSending(true)

    try {
      const response = await fetch('https://formsubmit.co/ajax/telles.jorge@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          whatsapp: formData.whatsapp,
          interest: activeTab === 'hire' ? 'Oportunidade Profissional' : 'Consultoria Empresarial',
          interestType: formData.interestType,
          message: formData.message,
          _subject: `Lead Portfólio: [${activeTab === 'hire' ? 'Vaga' : 'Consultoria'}] ${formData.name}`
        })
      })

      const data = await response.json()

      if (response.ok && data.success === 'true') {
        setSubmitted(true)
        try {
          const existing = window.localStorage.getItem('jorge-contact-leads')
          const items = existing ? JSON.parse(existing) : []
          items.unshift({ ...formData, tab: activeTab, date: new Date().toISOString() })
          window.localStorage.setItem('jorge-contact-leads', JSON.stringify(items.slice(0, 10)))
        } catch {
          // ignore
        }
      } else {
        const msg = data.message || ''
        if (msg.toLowerCase().includes('activate') || msg.toLowerCase().includes('confirm')) {
          setErrorMsg(t({
            pt: 'O formulário ainda não foi ativado por e-mail. Por favor, verifique a caixa de entrada (e Spam) de telles.jorge@gmail.com para clicar no link de ativação do FormSubmit.co. Você também pode enviar agora pelo WhatsApp ou E-mail abaixo:',
            en: 'This form has not been activated via email yet. Please check the spam folder at telles.jorge@gmail.com for the FormSubmit activation link. You can also send this information via WhatsApp or direct email below:'
          }))
        } else {
          setErrorMsg(msg || t({
            pt: 'Falha ao enviar mensagem. Por favor, utilize os botões diretos de WhatsApp/E-mail abaixo para enviar os dados sem perdas:',
            en: 'Failed to send message. Please use the WhatsApp or direct Email buttons below to transmit your request:'
          }))
        }
      }
    } catch (err) {
      setErrorMsg(t({
        pt: 'Erro de conexão ao enviar o formulário. Por favor, clique em um dos botões abaixo para enviar a mensagem diretamente:',
        en: 'Network error sending this form. Please click one of the buttons below to forward your message directly:'
      }))
    } finally {
      setIsSending(false)
    }
  }

  const resumeUrl = language === 'en' ? profile.actions.resumeEn : profile.actions.resume
  const whatsappUrl = language === 'en' ? profile.actions.whatsappEn : profile.actions.whatsapp

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0071e3]">
            {t({ pt: 'Contato & Propostas', en: 'Contact & Proposals' })}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
            {t({ pt: 'Vamos iniciar uma conversa estratégica', en: 'Let\'s start a strategic conversation' })}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#6e6e73]">
            {t({
              pt: 'Escolha o canal que preferir ou preencha o formulário abaixo para desenharmos uma solução sob medida para sua empresa ou diretoria.',
              en: 'Choose your preferred channel or fill out the form below to outline a tailored solution for your firm or board.'
            })}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] max-w-6xl mx-auto">
          {/* Quick Channels & Info */}
          <div className="space-y-8">
            <div className="rounded-[32px] border border-black/5 bg-white p-6 lg:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-black/5 pb-4">
                <ProfilePortrait variant="avatar" size="sm" className="rounded-full shadow-sm" />
                <div>
                  <h4 className="text-base font-bold text-[#1d1d1f]">Jorge Telles</h4>
                  <p className="text-xs text-[#6e6e73]">
                    {t({ pt: 'Controller Estratégico & FP&A', en: 'Strategic Controller & FP&A' })}
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f] pt-1">
                {t({ pt: 'Canais Diretos', en: 'Direct Channels' })}
              </h3>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                {t({
                  pt: 'Fale diretamente comigo através de canais consolidados de relacionamento profissional.',
                  en: 'Talk to me directly through standard professional channels.'
                })}
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 text-sm font-semibold text-[#1d1d1f] transition hover:bg-[#fafafa]"
                >
                  <span className="rounded-full bg-[#34c759]/10 p-2 text-[#34c759]">
                    <Smartphone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">WhatsApp</p>
                    <p className="text-xs text-[#8e8e93]">
                      {t({ pt: 'Resposta rápida em horário comercial', en: 'Fast response during business hours' })}
                    </p>
                  </div>
                </a>

                <a
                  href={profile.actions.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 text-sm font-semibold text-[#1d1d1f] transition hover:bg-[#fafafa]"
                >
                  <span className="rounded-full bg-[#0071e3]/10 p-2 text-[#0071e3]">
                    <Linkedin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">LinkedIn</p>
                    <p className="text-xs text-[#8e8e93]">
                      {t({ pt: 'Conecte-se e veja publicações', en: 'Connect and view recent publications' })}
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:contato@jorgetelles.com.br"
                  className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 text-sm font-semibold text-[#1d1d1f] transition hover:bg-[#fafafa]"
                >
                  <span className="rounded-full bg-[#8e8e93]/10 p-2 text-slate-600">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">{t({ pt: 'E-mail Corporativo', en: 'Corporate Email' })}</p>
                    <p className="text-xs text-[#8e8e93]">contato@jorgetelles.com.br</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick CV Widget */}
            <div className="rounded-[32px] border border-black/5 bg-[#fafafa] p-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#1d1d1f]">
                  {t({ pt: 'Currículo Atualizado', en: 'Updated Resume' })}
                </h4>
                <p className="text-xs text-[#8e8e93] mt-1">
                  {t({ pt: 'Baixe a versão executiva em PDF', en: 'Download executive PDF version' })}
                </p>
              </div>
              <a
                href={resumeUrl}
                download
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0071e3] text-white hover:bg-[#2997ff] transition"
              >
                <Download className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Interactive Form with Tabs */}
          <div className="rounded-[32px] border border-black/5 bg-white p-6 lg:p-8 shadow-sm">
            {/* Tabs */}
            <div className="flex border-b border-black/5 mb-8">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('hire')
                  setSubmitted(false)
                }}
                className={`flex-1 pb-4 text-xs font-bold uppercase tracking-wider transition border-b-2 text-center ${
                  activeTab === 'hire'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                💼 {t({ pt: 'Oportunidade Profissional', en: 'Professional Job' })}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('consulting')
                  setSubmitted(false)
                }}
                className={`flex-1 pb-4 text-xs font-bold uppercase tracking-wider transition border-b-2 text-center ${
                  activeTab === 'consulting'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                📈 {t({ pt: 'Consultoria Empresarial', en: 'Business Consulting' })}
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="inline-flex rounded-full bg-emerald-100 p-3 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1d1d1f]">
                  {t({ pt: 'Mensagem enviada com sucesso!', en: 'Message sent successfully!' })}
                </h3>
                <p className="text-sm text-[#6e6e73] max-w-md mx-auto">
                  {t({
                    pt: 'Jorge Telles recebeu sua solicitação. O tempo de resposta estimado é de até 24 horas úteis.',
                    en: 'Jorge Telles received your request. The estimated response time is up to 24 business hours.'
                  })}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', company: '', email: '', whatsapp: '', interestType: '', message: '' })
                  }}
                  className="mt-6 rounded-full bg-[#0071e3] px-6 py-2 text-xs font-semibold text-white hover:bg-[#2997ff] transition"
                >
                  {t({ pt: 'Enviar nova mensagem', en: 'Send new message' })}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-xs font-semibold text-[#424245]">
                    <span>{t({ pt: 'Nome Completo *', en: 'Full Name *' })}</span>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t({ pt: 'Seu nome', en: 'Your name' })}
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:bg-white"
                    />
                  </label>

                  <label className="space-y-2 text-xs font-semibold text-[#424245]">
                    <span>{t({ pt: 'Empresa', en: 'Company' })}</span>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={t({ pt: 'Nome da empresa', en: 'Company name' })}
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:bg-white"
                    />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-xs font-semibold text-[#424245]">
                    <span>{t({ pt: 'E-mail Corporativo *', en: 'Corporate Email *' })}</span>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="exemplo@empresa.com"
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:bg-white"
                    />
                  </label>

                  <label className="space-y-2 text-xs font-semibold text-[#424245]">
                    <span>{t({ pt: 'WhatsApp / Celular', en: 'WhatsApp / Phone' })}</span>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:bg-white"
                    />
                  </label>
                </div>

                {activeTab === 'hire' ? (
                  <label className="space-y-2 text-xs font-semibold text-[#424245]">
                    <span>{t({ pt: 'Tipo de Vaga / Oportunidade', en: 'Position type / Opportunity' })}</span>
                    <select
                      value={formData.interestType}
                      onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:bg-white"
                    >
                      <option value="">{t({ pt: 'Selecione uma opção', en: 'Select an option' })}</option>
                      <option value="controller">
                        {t({ pt: 'Controller Sênior / Gerente de Controladoria', en: 'Senior Controller / Controllership Manager' })}
                      </option>
                      <option value="fpa">
                        {t({ pt: 'Especialista FP&A / Planejamento Financeiro', en: 'FP&A Specialist / Financial Planner' })}
                      </option>
                      <option value="business-partner">
                        {t({ pt: 'Business Partner Financeiro', en: 'Financial Business Partner' })}
                      </option>
                      <option value="cfo-adjunct">
                        {t({ pt: 'CFO / Diretoria de Controladoria', en: 'CFO / Controller Director' })}
                      </option>
                    </select>
                  </label>
                ) : (
                  <label className="space-y-2 text-xs font-semibold text-[#424245]">
                    <span>{t({ pt: 'Serviço de Consultoria Pretendido', en: 'Desired Consulting Service' })}</span>
                    <select
                      value={formData.interestType}
                      onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:bg-white"
                    >
                      <option value="">{t({ pt: 'Selecione uma opção', en: 'Select an option' })}</option>
                      <option value="diagnostico-express">
                        {t({ pt: 'Diagnóstico Financeiro Express', en: 'Express Financial Diagnosis' })}
                      </option>
                      <option value="controladoria-inteligente">
                        {t({ pt: 'Estruturação de Controladoria', en: 'Controllership Structuring' })}
                      </option>
                      <option value="fpa-dashboards">
                        {t({ pt: 'FP&A e Dashboards (Power BI / IA)', en: 'FP&A & Dashboards (Power BI / AI)' })}
                      </option>
                      <option value="custom">
                        {t({ pt: 'Consultoria Sob Demanda', en: 'On-Demand Consulting' })}
                      </option>
                    </select>
                  </label>
                )}

                <label className="space-y-2 text-xs font-semibold text-[#424245]">
                  <span>{t({ pt: 'Detalhamento da Proposta / Escopo *', en: 'Scope detail / Proposal *' })}</span>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      activeTab === 'hire'
                        ? t({
                            pt: 'Descreva brevemente os desafios da vaga e modelo de atuação (presencial, híbrido ou remoto)...',
                            en: 'Briefly describe the key position challenges and location model (onsite, hybrid, or remote)...'
                          })
                        : t({
                            pt: 'Descreva os principais desafios que sua empresa está enfrentando em custos, margens, estoque ou controle de caixa...',
                            en: 'Describe the main challenges your firm is facing in cost structure, margins, inventory, or cash control...'
                          })
                    }
                    className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:bg-white"
                  />
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-black/5 bg-slate-50 p-4 text-xs text-[#424245]">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={() => {
                      setConsent(!consent)
                      setErrorMsg('')
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-black/10 text-[#0071e3] focus:ring-[#0071e3]"
                  />
                  <span>
                    {t({
                      pt: 'Concordo com o tratamento de meus dados exclusivamente para fins de contato profissional, conforme a Política de Privacidade e as regras da LGPD (Lei nº 13.709/18).',
                      en: 'I agree to the treatment of my data exclusively for professional contact purposes, in accordance with the Privacy Policy and LGPD/GDPR regulations.'
                    })}
                  </span>
                </label>

                {errorMsg && (
                  <div className="space-y-3 rounded-2xl border border-[#ff3b30]/15 bg-[#ff3b30]/5 p-4 text-xs">
                    <p className="text-[#ff3b30] font-semibold leading-relaxed">{errorMsg}</p>
                    
                    <div className="pt-1 flex flex-wrap gap-2.5">
                      <a
                        href={getWhatsAppFallbackLink()}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#34c759] px-4.5 py-2 text-[11px] font-bold text-white hover:bg-[#2db74c] transition shadow-sm"
                      >
                        🚀 {t({ pt: 'Enviar Tudo por WhatsApp', en: 'Send All via WhatsApp' })}
                      </a>
                      <a
                        href={getMailtoFallbackLink()}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-4.5 py-2 text-[11px] font-bold text-white hover:bg-slate-900 transition shadow-sm"
                      >
                        ✉️ {t({ pt: 'Enviar Tudo por E-mail Direto', en: 'Send All via Direct Email' })}
                      </a>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2997ff] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                      <span>{t({ pt: 'Enviando...', en: 'Sending...' })}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>
                        {activeTab === 'hire'
                          ? t({ pt: 'Falar sobre oportunidade', en: 'Discuss opportunity' })
                          : t({ pt: 'Solicitar diagnóstico', en: 'Request diagnosis' })}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
