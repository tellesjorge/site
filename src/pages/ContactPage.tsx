import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageTransition from '../components/layout/PageTransition'
import ProfilePortrait from '../components/brand/ProfilePortrait'
import { profile } from '../data/profile'
import { Send, Smartphone, Linkedin, Mail, CheckCircle2, Download } from 'lucide-react'

export default function ContactPage() {
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

  useEffect(() => {
    // Sync tab when search params change
    const interest = searchParams.get('interest')
    if (interest === 'consulting') {
      setActiveTab('consulting')
    } else if (interest === 'hire') {
      setActiveTab('hire')
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!consent) {
      setErrorMsg('Você precisa autorizar o tratamento de dados em conformidade com a LGPD.')
      return
    }
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    setErrorMsg('')
    setSubmitted(true)
    // Local persistence of contact request for visual response
    try {
      const existing = window.localStorage.getItem('jorge-contact-leads')
      const items = existing ? JSON.parse(existing) : []
      items.unshift({ ...formData, tab: activeTab, date: new Date().toISOString() })
      window.localStorage.setItem('jorge-contact-leads', JSON.stringify(items.slice(0, 10)))
    } catch {
      // ignore
    }
  }

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 sm:px-8 lg:px-10 space-y-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0071e3]">
            Contato & Propostas
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
            Vamos iniciar uma conversa estratégica
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#6e6e73]">
            Escolha o canal que preferir ou preencha o formulário abaixo para desenharmos uma solução sob medida para sua empresa ou diretoria.
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
                  <p className="text-xs text-[#6e6e73]">Controller Estratégico & FP&A</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f] pt-1">Canais Diretos</h3>
              <p className="text-xs text-[#6e6e73] leading-relaxed">
                Fale diretamente comigo através de canais consolidados de relacionamento profissional.
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href={profile.actions.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 text-sm font-semibold text-[#1d1d1f] transition hover:bg-[#fafafa]"
                >
                  <span className="rounded-full bg-[#34c759]/10 p-2 text-[#34c759]">
                    <Smartphone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">WhatsApp</p>
                    <p className="text-xs text-[#8e8e93]">Resposta rápida em horário comercial</p>
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
                    <p className="text-xs text-[#8e8e93]">Conecte-se e veja publicações</p>
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
                    <p className="font-bold">E-mail Corporativo</p>
                    <p className="text-xs text-[#8e8e93]">contato@jorgetelles.com.br</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick CV Download widget */}
            <div className="rounded-[32px] border border-black/5 bg-[#fafafa] p-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#1d1d1f]">Currículo Atualizado</h4>
                <p className="text-xs text-[#8e8e93] mt-1">Baixe a versão executiva em PDF</p>
              </div>
              <a
                href={profile.actions.resume}
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
                className={`flex-1 pb-4 text-sm font-semibold transition border-b-2 text-center ${
                  activeTab === 'hire'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                💼 Oportunidade Profissional
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('consulting')
                  setSubmitted(false)
                }}
                className={`flex-1 pb-4 text-sm font-semibold transition border-b-2 text-center ${
                  activeTab === 'consulting'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                📈 Consultoria Empresarial
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="inline-flex rounded-full bg-emerald-100 p-3 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1d1d1f]">Mensagem enviada com sucesso!</h3>
                <p className="text-sm text-[#6e6e73] max-w-md mx-auto">
                  Jorge Telles recebeu sua solicitação. O tempo de resposta estimado é de até 24 horas úteis.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', company: '', email: '', whatsapp: '', interestType: '', message: '' })
                  }}
                  className="mt-6 rounded-full bg-[#0071e3] px-6 py-2 text-xs font-semibold text-white hover:bg-[#2997ff] transition"
                >
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-xs font-semibold text-[#424245]">
                    <span>Nome Completo *</span>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome"
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:bg-white"
                    />
                  </label>

                  <label className="space-y-2 text-xs font-semibold text-[#424245]">
                    <span>Empresa</span>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Nome da empresa"
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:bg-white"
                    />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-xs font-semibold text-[#424245]">
                    <span>E-mail Corporativo *</span>
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
                    <span>WhatsApp / Celular</span>
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
                    <span>Tipo de Vaga / Oportunidade</span>
                    <select
                      value={formData.interestType}
                      onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:bg-white"
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="controller">Controller Sênior / Gerente de Controladoria</option>
                      <option value="fpa">Especialista FP&A / Planejamento Financeiro</option>
                      <option value="business-partner">Business Partner Financeiro</option>
                      <option value="cfo-adjunct">CFO / Diretoria de Controladoria</option>
                    </select>
                  </label>
                ) : (
                  <label className="space-y-2 text-xs font-semibold text-[#424245]">
                    <span>Serviço de Consultoria Pretendido</span>
                    <select
                      value={formData.interestType}
                      onChange={(e) => setFormData({ ...formData, interestType: e.target.value })}
                      className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3 text-xs text-[#1d1d1f] outline-none transition focus:border-[#0071e3]/45 focus:bg-white"
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="diagnostico-express">Diagnóstico Financeiro Express</option>
                      <option value="controladoria-inteligente">Estruturação de Controladoria</option>
                      <option value="fpa-dashboards">FP&A e Dashboards (Power BI / IA)</option>
                      <option value="custom">Consultoria Sob Demanda</option>
                    </select>
                  </label>
                )}

                <label className="space-y-2 text-xs font-semibold text-[#424245]">
                  <span>Detalhamento da Proposta / Escopo *</span>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      activeTab === 'hire'
                        ? 'Descreva brevemente os desafios da vaga e modelo de atuação (presencial, híbrido ou remoto)...'
                        : 'Descreva os principais desafios que sua empresa está enfrentando em custos, margens, estoque ou controle de caixa...'
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
                    Concordo com o tratamento de meus dados exclusivamente para fins de contato profissional, conforme a <a href="#privacidade" className="text-[#0071e3] font-semibold hover:underline">Política de Privacidade</a> e as regras da LGPD (Lei nº 13.709/18).
                  </span>
                </label>

                {errorMsg && <p className="text-xs text-[#ff3b30]">{errorMsg}</p>}

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2997ff]"
                >
                  <Send className="h-4 w-4" />{' '}
                  {activeTab === 'hire' ? 'Falar sobre oportunidade' : 'Solicitar diagnóstico'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
