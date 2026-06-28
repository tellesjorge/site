import { motion } from 'framer-motion'
import { Database, Eye, ShieldCheck, Mail } from 'lucide-react'

function PrivacyPolicy() {
  return (
    <motion.section
      id="privacidade"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="mb-20 rounded-[32px] border border-black/5 bg-white/90 p-8 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-2xl bg-[#0071e3]/10 p-2 text-[#0071e3]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#0071e3] font-semibold">LGPD</p>
          <h2 className="text-3xl font-semibold text-[#1d1d1f]">Política de Privacidade</h2>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[24px] border border-black/5 bg-slate-50 p-5">
          <div className="flex items-center gap-2 text-[#0071e3]">
            <Eye className="h-4 w-4" />
            <h3 className="font-semibold text-[#1d1d1f]">O que coletamos</h3>
          </div>
          <p className="mt-3 text-xs text-[#6e6e73] leading-relaxed">
            Coletamos apenas os dados que você voluntariamente fornece ao entrar em contato, como nome, e-mail, celular e mensagem.
          </p>
        </div>

        <div className="rounded-[24px] border border-black/5 bg-slate-50 p-5">
          <div className="flex items-center gap-2 text-[#0071e3]">
            <Database className="h-4 w-4" />
            <h3 className="font-semibold text-[#1d1d1f]">Para que usamos</h3>
          </div>
          <p className="mt-3 text-xs text-[#6e6e73] leading-relaxed">
            Os dados são usados exclusivamente para responder à sua mensagem, agendar conversas ou fornecer propostas profissionais.
          </p>
        </div>

        <div className="rounded-[24px] border border-black/5 bg-slate-50 p-5">
          <div className="flex items-center gap-2 text-[#0071e3]">
            <Mail className="h-4 w-4" />
            <h3 className="font-semibold text-[#1d1d1f]">Seus direitos</h3>
          </div>
          <p className="mt-3 text-xs text-[#6e6e73] leading-relaxed">
            Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelo canal de contato indicado.
          </p>
        </div>
      </div>

      <p className="mt-8 text-xs leading-7 text-[#6e6e73]">
        Este site não utiliza cookies de marketing ou rastreamento para fins comerciais. A navegação é tratada de forma transparente e os dados fornecidos por você serão protegidos conforme a legislação brasileira vigente.
      </p>
    </motion.section>
  )
}

export default PrivacyPolicy
