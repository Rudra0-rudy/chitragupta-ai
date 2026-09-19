import { motion } from 'framer-motion'

const FEATURES = [
  {
    name: 'Cost Ratio',
    formula: 'work_cost ÷ median(peer_cost)',
    signal: '> 2.0 · inflated cost or over-billing',
    inverse: '< 0.3 · ghost or shell work',
  },
  {
    name: 'Completion Speed Ratio',
    formula: 'days_to_complete ÷ median(peer_days)',
    signal: '>> 1.0 · chronic delay',
    inverse: '<< 1.0 · implausible on-paper completion',
  },
  {
    name: 'Vendor Concentration',
    formula: 'agency_works ÷ mean(works per agency)',
    signal: '> 3.0 · cartelisation or favouritism',
    inverse: '— (low values not flagged)',
  },
  {
    name: 'Payment Mismatch',
    formula: 'released_pct − expected_pct[status]',
    signal: '> +20% · money ahead of progress',
    inverse: '< −20% · work done, not paid',
  },
  {
    name: 'Cost Estimate',
    formula: 'raw cost, unscaled (₹)',
    signal: 'anchor — keeps absolute scale visible',
    inverse: '— (context, not a signal)',
  },
]

export function FeatureTable() {
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
            Feature Reference
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#1A1A18] tracking-tight mb-4">
            What Every Model Sees
          </h2>
          <p className="text-[#4A4845] text-lg max-w-2xl">
            The five engineered features that feed both anomaly detectors, with the thresholds that flag a work.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="border-2 border-[#1A1A18] bg-white overflow-x-auto"
        >
          <table className="w-full border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b-2 border-[#1A1A18] bg-[#F5F2E8]">
                {['Feature', 'Definition', 'High-Side Signal', 'Low-Side Signal'].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#8A8680]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#1A1A18]">
              {FEATURES.map((f) => (
                <tr key={f.name} className="hover:bg-[#F5F2E8] transition-colors">
                  <td className="px-5 py-5">
                    <span className="text-sm font-black uppercase tracking-tight text-[#1A1A18]">
                      {f.name}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <code className="text-xs font-mono text-[#4A4845] bg-[#F5F2E8] border border-[#8A8680] px-2 py-1 inline-block">
                      {f.formula}
                    </code>
                  </td>
                  <td className="px-5 py-5">
                    <span className="text-xs text-[#C8302A] font-medium">{f.signal}</span>
                  </td>
                  <td className="px-5 py-5">
                    <span className="text-xs text-[#4A4845]">{f.inverse}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
