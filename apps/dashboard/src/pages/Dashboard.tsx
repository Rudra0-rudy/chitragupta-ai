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
    <div className="min-h-screen bg-[#F5F2E8] flex flex-col">
      {/* Simple top bar */}
      <header className="border-b-2 border-[#1A1A18] bg-[#F5F2E8] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="dashboard-back-btn"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-[#1A1A18] hover:text-[#1E3878] text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
            <span className="text-[#8A8680]">/</span>
            <span className="text-[#1A1A18] text-sm font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-[#1A1A18] text-sm hidden sm:block">
                Welcome, <span className="text-[#1E3878] font-medium">{user.name}</span>
              </span>
            )}
            <Button
              id="dashboard-logout-btn"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-[#C8302A] hover:bg-[#1A1A18] hover:text-[#F5F2E8] rounded-none gap-2"
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
            className="inline-flex items-center justify-center w-24 h-24 rounded-none bg-[#E8C018] border-2 border-[#1A1A18] mb-8 mx-auto"
          >
            <Construction className="w-10 h-10 text-[#1A1A18]" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A18] mb-4 tracking-tight">
            Dashboard Under Construction
          </h1>
          <p className="text-[#4A4845] text-lg mb-8 leading-relaxed">
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
                  className={`w-4 h-4 rounded-none flex items-center justify-center shrink-0 ${
                    item.done ? 'bg-[#1E3878] border-2 border-[#1A1A18]' : 'bg-white border-2 border-[#1A1A18]'
                  }`}
                >
                  {item.done && <div className="w-2 h-2 rounded-none bg-[#F5F2E8]" />}
                </div>
                <span
                  className={`text-sm font-bold ${item.done ? 'text-[#1A1A18]' : 'text-[#8A8680]'}`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <Button
            id="dashboard-go-home-btn"
            onClick={() => navigate('/')}
            className="rounded-none bg-[#1E3878] hover:bg-[#1A1A18] text-[#F5F2E8] border-2 border-[#1A1A18] font-bold uppercase transition-all duration-300"
          >
            Back to Home
          </Button>
        </motion.div>
      </main>
    </div>
  )
}
