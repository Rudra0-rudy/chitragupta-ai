import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F5F2E8] flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* Big 404 */}
        <p className="font-black text-[#1A1A18] leading-none tracking-tighter text-8xl sm:text-9xl mb-6">
          404
        </p>

        {/* Yellow tag */}
        <div className="inline-block bg-[#E8C018] text-[#1A1A18] border-2 border-[#1A1A18] rounded-none px-3 py-1 uppercase text-xs font-bold tracking-widest mb-6">
          Page Not Found
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-black uppercase tracking-tight text-[#1A1A18] mb-3">
          This route does not exist
        </h1>

        {/* Body */}
        <p className="text-[#4A4845] text-base leading-relaxed mb-8">
          The page you are looking for has been moved, deleted, or never existed.
          Use the button below to return to the dashboard.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/dashboard/overview')}
            className="inline-flex items-center gap-2 bg-[#1E3878] hover:bg-[#1A1A18] text-[#F5F2E8] border-2 border-[#1A1A18] rounded-none font-bold uppercase px-6 py-3 transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#E8C018] text-[#1A1A18] border-2 border-[#1A1A18] rounded-none font-bold uppercase px-6 py-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Home
          </button>
        </div>
      </motion.div>
    </div>
  )
}
