import { motion } from 'framer-motion'
import { ALERTS } from '@/data/mockAlerts'

export function TrustBar() {
  const uniqueStates = new Set(ALERTS.map((r) => r.state)).size
  const uniqueMPs    = new Set(ALERTS.map((r) => r.mp_name)).size
  const totalWorks   = ALERTS.length

  const items = [
    { label: 'Works Monitored', value: totalWorks.toLocaleString('en-IN') },
    { label: 'States Covered',  value: uniqueStates.toString() },
    { label: 'MPs in Scope',    value: uniqueMPs.toString() },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-[#F5F2E8] border-y-2 border-[#1A1A18]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-3 divide-x-2 divide-[#1A1A18]">
          {items.map((item) => (
            <div key={item.label} className="px-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-[#1A1A18] tracking-tight leading-none">
                {item.value}
              </p>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#8A8680] mt-1.5">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
