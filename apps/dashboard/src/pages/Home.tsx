import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { Stats } from '@/components/home/Stats'

export function Home() {
  return (
    <div className="min-h-screen bg-[#F5F2E8]">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Stats />

        {/* Contact section placeholder */}
        <section id="contact" className="py-24 bg-[#F5F2E8] border-t-2 border-[#1A1A18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-[#1A1A18] mb-4">Get In Touch</h2>
            <p className="text-[#4A4845] mb-8 max-w-md mx-auto">
              For access, partnership, or questions about the Chitragupta AI platform, reach out to
              the team.
            </p>
            <a
              href="mailto:contact@chitragupta.ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-[#1E3878] hover:bg-[#1A1A18] text-[#F5F2E8] border-2 border-[#1A1A18] font-bold uppercase transition-all duration-300"
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
