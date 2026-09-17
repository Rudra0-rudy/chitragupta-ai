import { useNavigate } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Play, TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

const floatingStats = [
  { icon: AlertTriangle, label: 'Anomalies Detected', value: '1,284', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { icon: CheckCircle, label: 'Compliant Projects', value: '94.2%', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { icon: Activity, label: 'Live Monitoring', value: 'Active', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

export function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 20% 50%, oklch(0.45 0.18 264) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, oklch(0.4 0.15 290) 0%, transparent 60%), radial-gradient(ellipse at 60% 80%, oklch(0.35 0.12 220) 0%, transparent 60%)',
          }}
        />

        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating orbs */}
        {[
          { top: '15%', left: '10%', size: 300, color: 'oklch(0.5 0.2 264)', delay: 0 },
          { top: '60%', right: '8%', size: 200, color: 'oklch(0.45 0.18 290)', delay: 3 },
          { top: '35%', right: '25%', size: 150, color: 'oklch(0.4 0.15 220)', delay: 6 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              top: orb.top,
              left: orb.left,
              right: orb.right,
              width: orb.size,
              height: orb.size,
              background: orb.color,
              opacity: 0.15,
            }}
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: orb.delay,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Government Technology Initiative · MPLADS
          </motion.div>


          {/* Main heading */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6"
            >
              AI-Powered Monitoring
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  for MPLADS
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Detecting anomalies, preventing fraud, and ensuring transparency in public fund
              utilization. Real-time intelligence for every rupee of public money.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button
                id="hero-get-started-btn"
                size="lg"
                onClick={() => navigate('/login')}
                className="group relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 text-base shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Button>
              <Button
                id="hero-demo-btn"
                size="lg"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="group border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 px-8 py-3 text-base backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                View Demo
              </Button>
            </motion.div>

            {/* Floating stat cards */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {floatingStats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${stat.bg} backdrop-blur-sm`}
                >
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <div className="text-left">
                    <div className={`text-sm font-semibold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Hero visual - abstract data visualization */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-20 relative"
        >
          <div className="relative max-w-4xl mx-auto rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="ml-4 text-xs text-slate-500 font-mono">chitragupta-ai · live-monitor</span>
            </div>

            {/* Mock dashboard preview */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Sanctioned', value: '₹4,466 Cr', trend: '+2.3%', up: true },
                  { label: 'Risk Score (avg)', value: '23.4', trend: '-5.1%', up: false },
                  { label: 'Alerts Today', value: '47', trend: '+12', up: true },
                ].map((card) => (
                  <div key={card.label} className="p-4 rounded-xl bg-slate-800/60 border border-white/5">
                    <div className="text-xs text-slate-500 mb-1">{card.label}</div>
                    <div className="text-xl font-bold text-white">{card.value}</div>
                    <div className={`flex items-center gap-1 text-xs mt-1 ${card.up ? 'text-emerald-400' : 'text-blue-400'}`}>
                      <TrendingUp className="w-3 h-3" />
                      {card.trend}
                    </div>
                  </div>
                ))}
              </div>
              {/* Fake chart bars */}
              <div className="space-y-2">
                {[
                  { label: 'Maharashtra', pct: 82, color: 'bg-blue-500' },
                  { label: 'Uttar Pradesh', pct: 67, color: 'bg-indigo-500' },
                  { label: 'Rajasthan', pct: 91, color: 'bg-emerald-500' },
                  { label: 'Bihar', pct: 45, color: 'bg-amber-500' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="text-xs text-slate-500 w-32 shrink-0">{row.label}</div>
                    <div className="flex-1 h-2 bg-slate-700/60 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${row.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${row.pct}%` }}
                        transition={{ duration: 1.2, delay: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="text-xs text-slate-400 w-8 text-right">{row.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Glow below hero visual */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-blue-500/20 blur-3xl rounded-full" />
        </motion.div>
      </div>
    </section>
  )
}
