import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { Stats } from '@/components/home/Stats'

export function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Stats />

        {/* Contact section placeholder */}
        <section id="contact" className="py-24 bg-slate-950 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              For access, partnership, or questions about the Chitragupta AI platform, reach out to
              the team.
            </p>
            <a
              href="mailto:contact@chitragupta.ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              Contact Team
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
