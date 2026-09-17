import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  {
    value: 4466,
    prefix: '₹',
    suffix: ' Cr',
    label: 'Total Sanctioned',
    subLabel: 'Across all MPLADS constituencies',
    color: 'from-blue-400 to-indigo-400',
  },
  {
    value: 700,
    prefix: '',
    suffix: '+',
    label: 'Districts Monitored',
    subLabel: 'Nation-wide coverage',
    color: 'from-emerald-400 to-teal-400',
  },
  {
    value: 24,
    prefix: '',
    suffix: '/7',
    label: 'Automated Alerts',
    subLabel: 'Continuous AI surveillance',
    color: 'from-violet-400 to-purple-400',
  },
  {
    value: 98.4,
    prefix: '',
    suffix: '%',
    label: 'Detection Accuracy',
    subLabel: 'ML model precision rate',
    color: 'from-amber-400 to-orange-400',
  },
]

function CountUp({
  target,
  decimals = 0,
  duration = 2000,
}: {
  target: number
  decimals?: number
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(parseFloat((target * eased).toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration, decimals])

  return <span ref={ref}>{count.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>
}

export function Stats() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/[0.04] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-blue-500/5 border border-blue-500/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
            Impact at Scale
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            Numbers That Matter
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Real impact on transparency and accountability in India's public infrastructure
            spending.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.04, y: -6 }}
              className="relative group"
            >
              <div className="relative p-8 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all duration-300">
                {/* Gradient accent top */}
                <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`} />

                <div className={`text-4xl lg:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.prefix}
                  <CountUp
                    target={stat.value}
                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                    duration={2000}
                  />
                  {stat.suffix}
                </div>
                <div className="text-white font-semibold text-sm mb-1">{stat.label}</div>
                <div className="text-slate-500 text-xs">{stat.subLabel}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
