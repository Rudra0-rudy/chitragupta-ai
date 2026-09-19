import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export function QuoteSection() {
  return (
    <section className="py-24 bg-[#F5F2E8] border-t-2 border-[#1A1A18]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative bg-white border-2 border-[#1A1A18] rounded-none p-10 sm:p-12"
        >
          <Quote className="w-10 h-10 text-[#C8302A] mb-6" strokeWidth={2.5} />
          <p className="text-2xl sm:text-3xl font-black text-[#1A1A18] leading-snug tracking-tight mb-8">
            For the first time, we can see which works need attention before the money is spent.
          </p>
          <footer className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#1E3878]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A18]">
                District Authority
              </p>
              <p className="text-xs uppercase tracking-widest text-[#8A8680] mt-0.5">
                Maharashtra
              </p>
            </div>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  )
}
