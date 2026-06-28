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
      className="mb-20 rounded-[32px] border border-white/10 bg-surface2/90 p-8 shadow-glass"
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-2xl bg-cyan-500/10 p-2 text-cyan-300">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">LGPD</p>
          <h2 className="text-3xl font-semibold text-white">Política de Privacidade</h2>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-5">
          <div className="flex items-center gap-2 text-cyan-300">
            <Eye className="h-4 w-4" />
            <h3 className="font-semibold text-white">O que coletamos</h3>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Coletamos apenas os dados que você voluntariamente fornece ao entrar em contato, como nome, e-mail e mensagem.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-5">
          <div className="flex items-center gap-2 text-cyan-300">
            <Database className="h-4 w-4" />
            <h3 className="font-semibold text-white">Para que usamos</h3>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Os dados são usados exclusivamente para responder à sua mensagem, agendar conversas ou fornecer informações profissionais.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-5">
          <div className="flex items-center gap-2 text-cyan-300">
            <Mail className="h-4 w-4" />
            <h3 className="font-semibold text-white">Seus direitos</h3>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento, enviando uma mensagem para o canal de contato indicado.
          </p>
        </div>
      </div>

      <p className="mt-8 text-sm leading-7 text-slate-400">
        Este site não utiliza cookies de marketing ou rastreamento para fins comerciais. A navegação é tratada de forma transparente e os dados fornecidos por você serão protegidos conforme a legislação brasileira vigente.
      </p>
    </motion.section>
  )
}

export default PrivacyPolicy
