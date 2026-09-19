import { useNavigate } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Play, AlertTriangle, CheckCircle, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

const floatingStats = [
  { icon: AlertTriangle, label: 'Anomalies Detected', value: '1,284', color: 'text-[#C8302A]', bg: 'bg-white border-2 border-[#1A1A18] rounded-none' },
  { icon: CheckCircle, label: 'Compliant Projects', value: '94.2%', color: 'text-[#1E3878]', bg: 'bg-white border-2 border-[#1A1A18] rounded-none' },
  { icon: Activity, label: 'Live Monitoring', value: 'Active', color: 'text-[#1E3878]', bg: 'bg-white border-2 border-[#1A1A18] rounded-none' },
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F5F2E8]">


      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-none border-2 border-[#1A1A18] bg-[#E8C018] text-[#1A1A18] text-xs font-bold uppercase tracking-widest mb-8"
          >
            <span className="w-2 h-2 rounded-none bg-[#1E3878]" />
            Government Technology Initiative · MPLADS
          </motion.div>


          {/* Main heading */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1A1A18] leading-tight tracking-tight mb-6"
            >
              AI-Powered Monitoring
              <br />
              <span className="relative">
                <span className="text-[#1A1A18]">
                  for MPLADS
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#1E3878] rounded-none"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-[#4A4845] max-w-2xl mx-auto mb-10 leading-relaxed"
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
                className="group relative overflow-hidden bg-[#1E3878] hover:bg-[#1A1A18] text-[#F5F2E8] border-2 border-[#1A1A18] rounded-none font-bold uppercase px-8 py-3 text-base transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button
                id="hero-demo-btn"
                size="lg"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="group bg-[#F5F2E8] text-[#1A1A18] border-2 border-[#1A1A18] rounded-none font-bold uppercase hover:bg-[#1A1A18] hover:text-[#F5F2E8] px-8 py-3 text-base transition-all duration-300"
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
                  className={`flex items-center gap-3 px-5 py-3 ${stat.bg}`}
                >
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <div className="text-left">
                    <div className={`text-sm font-semibold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-[#4A4845]">{stat.label}</div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-[#1A1A18] bg-white max-w-4xl mx-auto mt-16">
            <div className="border-b-2 md:border-b-0 md:border-r-2 border-[#1A1A18] p-6">
              <p className="text-xs uppercase tracking-wider text-[#4A4845] font-medium">Total Sanctioned</p>
              <p className="font-black text-3xl text-[#1A1A18] mt-2">₹4,466 Cr</p>
            </div>
            <div className="border-b-2 md:border-b-0 md:border-r-2 border-[#1A1A18] p-6">
              <p className="text-xs uppercase tracking-wider text-[#4A4845] font-medium">Avg Risk Score</p>
              <p className="font-black text-3xl text-[#1A1A18] mt-2">23.4</p>
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-wider text-[#4A4845] font-medium">Alerts Today</p>
              <p className="font-black text-3xl text-[#C8302A] mt-2">47</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
