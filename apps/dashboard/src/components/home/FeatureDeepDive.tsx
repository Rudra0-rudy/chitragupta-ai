import { motion, type Variants } from 'framer-motion'
import { Network, GitBranch } from 'lucide-react'

const DEEP_DIVES = [
  {
    icon: Network,
    eyebrow: 'Detection',
    title: 'Two Models, Two Notions of Anomaly',
    paragraphs: [
      'Fraud in MPLADS rarely looks the same twice. A ghost bridge with a hundred-fold cost ratio is a global outlier — obvious once isolated. A slightly inflated road repair in a small district is a contextual outlier — normal everywhere except its own peer group. A single detector misses one or the other.',
      'The platform runs two methodologically independent models. Isolation Forest isolates points quickly when they sit far from the bulk in feature space, catching global anomalies. Local Outlier Factor asks whether a point sits in a region that is thinner than its neighbours\' regions, catching contextual anomalies that are invisible to a global view.',
      'Their errors are not correlated. When both flag a work, the probability that this is coincidence is far smaller than for either alone. That agreement is what drives the High-risk tier.',
    ],
  },
  {
    icon: GitBranch,
    eyebrow: 'Explainability',
    title: 'Five Engineered Features, Every Alert',
    paragraphs: [
      'Raw values are misleading. A ₹50 lakh road in Kerala is not comparable to a ₹50 lakh road in Himachal Pradesh — terrain, labour, and logistics differ by a factor of two or three. The platform engineers five ratio-based features that normalise against peer groups before any model runs.',
      'Cost ratio compares a work\'s cost to the median of the same state and category. Completion speed ratio compares duration to category peers. Vendor concentration measures how much one agency dominates its state. Payment mismatch is a signed difference between money released and expected payment for status. Cost estimate anchors the anomaly to real money, unscaled, so the model never loses sight of absolute value.',
      'Every alert carries the feature values that produced it. Investigators see not just that a work is high-risk but which of the five features drove the score, and by how much.',
    ],
  },
]

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

export function FeatureDeepDive() {
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
            Under the Hood
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#1A1A18] tracking-tight mb-4">
            The Reasoning Behind the Score
          </h2>
          <p className="text-[#4A4845] text-lg max-w-2xl">
            Two anomaly detectors. Five engineered features. Every alert explainable.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {DEEP_DIVES.map((dive) => (
            <motion.article
              key={dive.title}
              variants={cardVariants}
              className="bg-white border-2 border-[#1A1A18] rounded-none p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-[#1E3878] border-2 border-[#1A1A18]">
                  <dive.icon className="w-5 h-5 text-[#F5F2E8]" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C8302A]">
                  {dive.eyebrow}
                </span>
              </div>

              <h3 className="text-2xl font-black tracking-tight text-[#1A1A18] mb-5 leading-tight">
                {dive.title}
              </h3>

              <div className="space-y-4">
                {dive.paragraphs.map((p, i) => (
                  <p key={i} className="text-sm text-[#4A4845] leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
