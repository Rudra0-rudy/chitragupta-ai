import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { Stats } from '@/components/home/Stats'
import { TrustBar } from '@/components/home/TrustBar'
import { HowItWorks } from '@/components/home/HowItWorks'
import { QuoteSection } from '@/components/home/QuoteSection'
import { CTASection } from '@/components/home/CTASection'
import { FeatureDeepDive } from '@/components/home/FeatureDeepDive'
import { FeatureTable } from '@/components/home/FeatureTable'
import { RoleCapabilities } from '@/components/home/RoleCapabilities'
export function Home() {
  return (
    <div className="min-h-screen bg-[#F5F2E8]">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Features />
        <FeatureDeepDive />
        <HowItWorks />
        <FeatureTable />
        <Stats />
        <QuoteSection />
        <RoleCapabilities />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
