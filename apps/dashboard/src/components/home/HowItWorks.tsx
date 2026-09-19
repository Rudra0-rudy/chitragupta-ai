import { motion, type Variants } from 'framer-motion'

const STEPS = [
  { num: '01', title: 'Ingest',  body: 'MPLADS sanction, expenditure, and completion records flow into the platform every cycle.' },
  { num: '02', title: 'Detect',  body: 'Isolation Forest and Local Outlier Factor scan every work across five engineered features.' },
  { num: '03', title: 'Triage',  body: 'High-risk works surface to the responsible authority with full evidence attached.' },
]

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#F5F2E8] border-t-2 border-[#1A1A18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16"
        >
          <span className="inline-block bg-[#E8C018] text-[#1A1A18] border-2 border-[#1A1A18] rounded-none px-3 py-1 uppercase text-xs font-bold tracking-widest mb-6">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#1A1A18] tracking-tight mb-4">
            From Raw Records to Ranked Alerts
          </h2>
          <p className="text-[#4A4845] text-lg max-w-2xl">
            Three stages. One pipeline.
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Connecting line behind cards (desktop only) */}
          <div className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-0.5 bg-[#1A1A18]" aria-hidden />

          {STEPS.map((step) => (
            <motion.div
              key={step.num}
              variants={cardVariants}
              className="relative bg-white border-2 border-[#1A1A18] rounded-none p-6"
            >
              {/* Number badge */}
              <div className="w-16 h-16 flex items-center justify-center bg-[#1E3878] text-[#F5F2E8] border-2 border-[#1A1A18] mb-6 relative z-10">
                <span className="font-black text-xl tracking-tight">{step.num}</span>
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-[#1A1A18] mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-[#4A4845] leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
