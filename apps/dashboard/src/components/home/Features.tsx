import { motion, type Variants } from 'framer-motion'
import { AlertTriangle, BarChart3, ShieldCheck, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const features = [
  {
    icon: AlertTriangle,
    title: 'Real-time Anomaly Detection',
    description:
      'Our ML models continuously scan fund disbursements, flagging irregularities like duplicate payments, over-inflated project costs, and suspicious contractor patterns in real time.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    glow: 'shadow-amber-500/10',
  },
  {
    icon: BarChart3,
    title: 'Risk Scoring Engine',
    description:
      'Each project receives a dynamic risk score based on 40+ parameters — geographic, financial, and historical — enabling prioritized audits and targeted investigations.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    glow: 'shadow-blue-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Automated Compliance',
    description:
      'Rule-based checks enforce MPLADS guidelines at every stage — from work order approval to utilization certificates — with automatic escalation for non-compliance.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    glow: 'shadow-emerald-500/10',
  },
  {
    icon: Zap,
    title: 'Predictive Insights',
    description:
      'Forecast fund absorption rates, predict project delays, and identify districts at risk of fund lapse before it happens — empowering proactive governance.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    glow: 'shadow-violet-500/10',
  },
]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6">
            Platform Capabilities
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            Intelligence at Every Layer
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From raw transaction data to actionable governance insights — our AI pipeline covers the
            entire MPLADS lifecycle.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <Card
                className={`h-full bg-slate-900/50 border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 shadow-xl ${feature.glow}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl border ${feature.bg} shrink-0`}>
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>

                  {/* Decorative bottom accent */}
                  <div className={`mt-4 h-0.5 w-12 rounded-full ${feature.bg.replace('bg-', 'bg-').split(' ')[0]}`} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
