import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Construction, ArrowLeft, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Simple top bar */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="dashboard-back-btn"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300 text-sm font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-slate-400 text-sm hidden sm:block">
                Welcome, <span className="text-white font-medium">{user.name}</span>
              </span>
            )}
            <Button
              id="dashboard-logout-btn"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-white hover:bg-white/10 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-lg"
        >
          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-8 mx-auto"
          >
            <Construction className="w-10 h-10 text-amber-400" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Dashboard Under Construction
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            The analytics dashboard is being built. The AI monitoring pipeline, fraud detection
            charts, and compliance reports will be available here soon.
          </p>

          {/* Progress indicators */}
          <div className="space-y-3 mb-10 text-left max-w-sm mx-auto">
            {[
              { label: 'Authentication & Routing', done: true },
              { label: 'Landing Page & UI Shell', done: true },
              { label: 'Analytics Dashboard', done: false },
              { label: 'Anomaly Detection Views', done: false },
              { label: 'Compliance Reports', done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    item.done ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-slate-800 border border-slate-700'
                  }`}
                >
                  {item.done && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>
                <span
                  className={`text-sm ${item.done ? 'text-slate-300' : 'text-slate-600'}`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <Button
            id="dashboard-go-home-btn"
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:scale-105 transition-all duration-300"
          >
            Back to Home
          </Button>
        </motion.div>
      </main>
    </div>
  )
}
