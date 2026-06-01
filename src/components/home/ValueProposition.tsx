import { motion } from 'framer-motion';
import { ScrollReveal3D } from '@/components/ui/ScrollReveal3D';
import { TrendingUp, Shield, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const valueProps = [
  {
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-400',
    title: 'Results-Driven',
    description:
      'Every decision is backed by data. We measure success by the growth we deliver to your business, not just deliverables.',
    stat: '3×',
    statLabel: 'Avg. ROI increase',
  },
  {
    icon: Shield,
    color: 'from-violet-500 to-purple-400',
    title: 'Enterprise-Grade Quality',
    description:
      'Rigorous testing, robust architecture and security best practices — built to scale as your business grows.',
    stat: '99.9%',
    statLabel: 'Uptime SLA',
  },
  {
    icon: Layers,
    color: 'from-emerald-500 to-teal-400',
    title: 'End-to-End Ownership',
    description:
      'From strategy and design to development and maintenance — one team, full accountability, zero excuses.',
    stat: '48h',
    statLabel: 'Avg. response time',
  },
  {
    icon: CheckCircle2,
    color: 'from-orange-500 to-amber-400',
    title: 'Transparent Process',
    description:
      'Real-time project tracking, weekly updates and open communication. You\'re always in the loop, never in the dark.',
    stat: '100%',
    statLabel: 'On-time delivery',
  },
];

export function ValueProposition() {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide mb-4 uppercase">
            Our Value Proposition
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
            Built Different.{' '}
            <span className="relative">
              <span className="relative z-10 text-primary">Delivered Different.</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/15 -skew-x-3 rounded" />
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We don't just write code — we architect solutions that move the needle for your business.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {valueProps.map((vp, index) => (
            <ScrollReveal3D key={vp.title} preset={index % 2 === 0 ? 'tiltLeft' : 'tiltRight'}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="group relative p-8 rounded-3xl bg-card border border-border hover:border-transparent transition-all duration-300 overflow-hidden"
              >
                {/* Hover gradient border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${vp.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className={`absolute inset-[1px] rounded-3xl bg-card group-hover:bg-card/95 transition-colors duration-300`} />

                <div className="relative z-10 flex gap-6">
                  {/* Icon */}
                  <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${vp.color} flex items-center justify-center shadow-lg`}>
                    <vp.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{vp.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {vp.description}
                    </p>
                    {/* Stat badge */}
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-black bg-gradient-to-r ${vp.color} bg-clip-text text-transparent`}>
                        {vp.stat}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {vp.statLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal3D>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-muted/50 border border-border"
        >
          <p className="text-muted-foreground text-sm">
            Trusted by startups and enterprises across 20+ countries.
          </p>
          <Button
            onClick={() => navigate('/quote')}
            className="shrink-0"
          >
            See how we can help you
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
