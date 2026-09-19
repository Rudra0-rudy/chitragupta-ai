import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'

export function CTASection() {
  const navigate = useNavigate()

  return (
    <section id="contact" className="bg-[#1E3878] border-t-2 border-[#1A1A18] border-b-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#E8C018] mb-4">
            Ready to Audit
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#F5F2E8] tracking-tight mb-5 max-w-3xl mx-auto">
            Sign in to the dashboard
          </h2>
          <p className="text-[#F5F2E8]/80 text-lg max-w-xl mx-auto mb-10">
            Access MPLADS monitoring, anomaly detection, and compliance reporting across all four stakeholder roles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 bg-[#F5F2E8] text-[#1A1A18] border-2 border-[#1A1A18] rounded-none font-bold uppercase px-8 py-3 hover:bg-[#E8C018] transition-colors"
            >
              Sign In
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <a
              href="mailto:contact@chitragupta.ai"
              className="inline-flex items-center gap-2 bg-transparent text-[#F5F2E8] border-2 border-[#F5F2E8] rounded-none font-bold uppercase px-8 py-3 hover:bg-[#F5F2E8] hover:text-[#1E3878] transition-colors"
            >
              <Mail className="w-4 h-4" strokeWidth={2.5} />
              Contact Team
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
