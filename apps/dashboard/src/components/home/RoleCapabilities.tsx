import { motion, type Variants } from 'framer-motion'
import { Users, Building2, MapPin, Shield } from 'lucide-react'

const ROLES = [
  {
    icon: Users,
    title: 'Members of Parliament',
    scope: 'Constituency',
    bullets: [
      'Recommended works summary',
      'Fund utilisation by category',
      'Flagged works in constituency',
    ],
  },
  {
    icon: MapPin,
    title: 'District Authorities',
    scope: 'District',
    bullets: [
      'Case queue sorted by risk',
      'Work-level anomaly evidence',
      'Mark reviewed, escalate',
    ],
  },
  {
    icon: Building2,
    title: 'State Nodal Authorities',
    scope: 'State',
    bullets: [
      'District-wise risk comparison',
      'Compliance threshold violations',
      'State-wide anomaly trends',
    ],
  },
  {
    icon: Shield,
    title: 'Ministry',
    scope: 'National',
    bullets: [
      'National risk heatmap',
      'Policy-level trend analysis',
      'Cross-state pattern detection',
    ],
  },
]

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

export function RoleCapabilities() {
  return (
    <section className="py-24 bg-[#F5F2E8] border-t-2 border-[#1A1A18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16"
        >
          <span className="inline-block bg-[#E8C018] text-[#1A1A18] border-2 border-[#1A1A18] rounded-none px-3 py-1 uppercase text-xs font-bold tracking-widest mb-6">
            Built for Every Stakeholder
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#1A1A18] tracking-tight mb-4">
            One Platform, Four Roles
          </h2>
          <p className="text-[#4A4845] text-lg max-w-2xl">
            The dashboard adapts to the scope of responsibility. Switch roles to see national, state, district, or constituency views.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          {ROLES.map((role) => (
            <motion.div
              key={role.title}
              variants={cardVariants}
              className="bg-white border-2 border-[#1A1A18] rounded-none p-6 h-full flex flex-col"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#1E3878] border-2 border-[#1A1A18] mb-5">
                <role.icon className="w-5 h-5 text-[#F5F2E8]" strokeWidth={2.5} />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8302A] mb-2">
                {role.scope}
              </span>

              <h3 className="text-base font-black uppercase tracking-tight text-[#1A1A18] mb-5 leading-tight">
                {role.title}
              </h3>

              <ul className="space-y-2.5 mt-auto">
                {role.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-[#4A4845] leading-relaxed">
                    <span className="shrink-0 mt-1.5 w-1 h-1 bg-[#1A1A18]" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
