import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setIsLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch {
      setError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-950 to-indigo-950/30" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(148, 163, 184, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
        />
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </motion.button>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-slate-900/80 backdrop-blur-xl border-white/15 shadow-2xl shadow-black/50">
          <CardHeader className="text-center pb-6 pt-8">
            {/* Logo */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-blue-500/40 blur-xl" />
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-slate-400 text-sm">Sign in to Chitragupta AI</p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-sm text-slate-300 font-medium">
                  Email address
                </label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="officer@mplads.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-sm text-slate-300 font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-800/60 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 h-11 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    id="toggle-password-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <Button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating…
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-slate-600 mt-6">
              Any valid email and password will work for demo access.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
