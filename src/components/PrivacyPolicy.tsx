import { motion } from 'framer-motion'
import { Database, Eye, ShieldCheck, Mail, UserCheck, ShieldAlert } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function PrivacyPolicy() {
  const { t } = useLanguage()

  return (
    <motion.section
      id="privacidade"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="mb-20 rounded-[32px] border border-black/5 bg-white/90 p-8 shadow-sm space-y-8"
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-2xl bg-[#0071e3]/10 p-2 text-[#0071e3]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#0071e3] font-semibold">
            {t({ pt: 'Conformidade Legal', en: 'Legal Compliance' })}
          </p>
          <h2 className="text-3xl font-semibold text-[#1d1d1f]">
            {t({ pt: 'Declaração de Privacidade (LGPD)', en: 'Privacy Statement (LGPD / GDPR)' })}
          </h2>
        </div>
      </div>

      <p className="text-xs text-[#6e6e73] leading-relaxed max-w-4xl">
        {t({
          pt: 'Esta Política de Privacidade descreve como os seus dados pessoais são coletados, tratados e protegidos no âmbito deste canal de comunicação de acordo com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018). Sob a ótica da LGPD, o controlador do tratamento de dados deste site é Jorge Telles.',
          en: 'This Privacy Policy describes how your personal data is collected, processed and protected within this communication channel in accordance with the General Personal Data Protection Law (LGPD - Law No. 13,709/2018). Under LGPD terms, the data controller for this site is Jorge Telles.'
        })}
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Box 1: O que coletamos */}
        <div className="rounded-[24px] border border-black/5 bg-slate-50 p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#0071e3]">
            <Eye className="h-4 w-4" />
            <h3 className="font-semibold text-xs text-[#1d1d1f] uppercase tracking-wider">
              {t({ pt: 'O que Coletamos', en: 'What We Collect' })}
            </h3>
          </div>
          <p className="text-[11px] text-[#6e6e73] leading-relaxed">
            {t({
              pt: 'Apenas os dados fornecidos voluntariamente por você ao enviar mensagens ou solicitar contatos no formulário: nome, e-mail corporativo, empresa, WhatsApp/celular e escopo do projeto de controladoria.',
              en: 'Only the data provided voluntarily by you when submitting messages or requesting contact via forms: name, corporate email, company name, WhatsApp/phone, and the scope of the project.'
            })}
          </p>
        </div>

        {/* Box 2: Finalidade */}
        <div className="rounded-[24px] border border-black/5 bg-slate-50 p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#0071e3]">
            <Database className="h-4 w-4" />
            <h3 className="font-semibold text-xs text-[#1d1d1f] uppercase tracking-wider">
              {t({ pt: 'Bases e Finalidades', en: 'Bases and Purposes' })}
            </h3>
          </div>
          <p className="text-[11px] text-[#6e6e73] leading-relaxed">
            {t({
              pt: 'Em conformidade com o Artigo 7º, I (Consentimento), os dados são utilizados unicamente para elaborar propostas de serviços de controladoria/FP&A, responder solicitações e agendar consultas.',
              en: 'In compliance with Article 7, I (Consent), data is used solely to draft controllership/FP&A proposals, answer your inquiries, and schedule professional meetings.'
            })}
          </p>
        </div>

        {/* Box 3: Segurança */}
        <div className="rounded-[24px] border border-black/5 bg-slate-50 p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#0071e3]">
            <ShieldAlert className="h-4 w-4" />
            <h3 className="font-semibold text-xs text-[#1d1d1f] uppercase tracking-wider">
              {t({ pt: 'Segurança e Retenção', en: 'Security & Retention' })}
            </h3>
          </div>
          <p className="text-[11px] text-[#6e6e73] leading-relaxed">
            {t({
              pt: 'Os dados são protegidos por criptografia de transporte (HTTPS) e armazenados temporariamente pelo prazo estritamente necessário para cumprir a finalidade de atendimento inicial da proposta comercial.',
              en: 'Data is protected by transport encryption (HTTPS) and stored temporarily for the duration strictly necessary to fulfill initial business queries.'
            })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 pt-4 border-t border-slate-100/60">
        {/* Direitos do Titular */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
            <UserCheck className="h-4.5 w-4.5 text-[#0071e3]" />
            {t({ pt: 'Seus Direitos Legais (Artigo 18 da LGPD)', en: 'Your Legal Rights (Article 18 LGPD)' })}
          </h4>
          <p className="text-[11px] text-[#6e6e73] leading-relaxed">
            {t({
              pt: 'Como titular dos dados, você pode exercer os seguintes direitos a qualquer momento por meio de requisição gratuita ao controlador:',
              en: 'As the data subject, you can exercise the following rights at any time via free request to the controller:'
            })}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-[#6e6e73] list-disc list-inside pl-1 font-medium">
            <li>{t({ pt: 'Confirmação da existência de tratamento', en: 'Confirmation of processing existence' })}</li>
            <li>{t({ pt: 'Acesso facilitado aos seus dados armazenados', en: 'Access to your stored data' })}</li>
            <li>{t({ pt: 'Correção de dados incompletos ou desatualizados', en: 'Correction of inaccurate data' })}</li>
            <li>{t({ pt: 'Eliminação de dados desnecessários ou excessivos', en: 'Deletion of unnecessary data' })}</li>
            <li>{t({ pt: 'Portabilidade a outro prestador de serviço', en: 'Portability to another provider' })}</li>
            <li>{t({ pt: 'Revogação imediata do consentimento concedido', en: 'Immediate revocation of consent' })}</li>
          </ul>
        </div>

        {/* DPO Encarregado */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
            <Mail className="h-4.5 w-4.5 text-[#0071e3]" />
            {t({ pt: 'Encarregado de Proteção de Dados / DPO (Artigo 41)', en: 'Data Protection Officer / DPO (Article 41)' })}
          </h4>
          <p className="text-[11px] text-[#6e6e73] leading-relaxed">
            {t({
              pt: 'Para tirar dúvidas sobre esta política, exercer seus direitos de acesso/exclusão ou revogar o consentimento do tratamento de dados pessoais, entre em contato diretamente com o nosso Encarregado (DPO):',
              en: 'To clear doubts about this policy, exercise your access/deletion rights, or revoke consent, contact our Data Protection Officer (DPO) directly:'
            })}
          </p>
          <div className="rounded-2xl border border-black/5 bg-slate-50/50 p-4 space-y-1 text-[11px] text-[#1d1d1f]">
            <p><strong>{t({ pt: 'Encarregado (DPO):', en: 'Officer (DPO):' })}</strong> Jorge Telles</p>
            <p><strong>{t({ pt: 'Canal de Atendimento:', en: 'Contact Channel:' })}</strong> <a href="mailto:contato@jorgetelles.com.br" className="text-[#0071e3] font-semibold hover:underline">contato@jorgetelles.com.br</a></p>
            <p className="text-[9px] text-[#8e8e93] mt-1.5">{t({ pt: 'O prazo máximo legal de resposta para requisições é de até 15 dias úteis.', en: 'The legal maximum response time for subject requests is up to 15 business days.' })}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 text-[10px] text-[#8e8e93] leading-relaxed border border-black/[0.03]">
        <strong>{t({ pt: 'Declaração de Cookies:', en: 'Cookies Declaration:' })}</strong>{' '}
        {t({
          pt: 'Este site não utiliza cookies de rastreamento comportamental, cookies de publicidade direcionada ou ferramentas invasivas de analytics de terceiros. Armazenamos apenas um cookie essencial de controle local para salvar sua preferência de aceitação da Política de Privacidade.',
          en: 'This website does not use behavioral tracking cookies, target marketing cookies or invasive third-party analytics tools. We store only one essential cookie key locally to save your acceptance preference for the Privacy Banner.'
        })}
      </div>
    </motion.section>
  )
}

export default PrivacyPolicy
