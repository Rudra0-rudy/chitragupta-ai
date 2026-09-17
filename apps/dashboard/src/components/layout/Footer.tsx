import { Link } from 'react-router-dom'
import { Shield, Code2, ExternalLink, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold text-lg">
                Chitragupta <span className="text-blue-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              AI-powered monitoring and analytics platform for MPLADS, ensuring transparency and
              efficiency in public fund utilization across India.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <Code2 className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@chitragupta.ai"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-medium text-sm mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {['Features', 'Dashboard', 'Analytics', 'Reports'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-medium text-sm mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Data Security', 'RTI'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Chitragupta AI. A Government Technology Initiative.
          </p>
          <p className="text-slate-600 text-xs">
            Built for transparency · Powered by AI · Secured by design
          </p>
        </div>
      </div>
    </footer>
  )
}
