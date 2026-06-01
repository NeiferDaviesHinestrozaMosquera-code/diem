import { motion } from 'framer-motion';
import { ScrollReveal3D } from '@/components/ui/ScrollReveal3D';
import { useCountUp } from '@/hooks/useCountUp';

function AnimatedStat({ target, suffix, label, index }: { target: number; suffix: string; label: string; index: number }) {
  const { ref, display } = useCountUp({ target, suffix, duration: 2.5 });
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      className="text-center"
    >
      <div ref={ref as React.Ref<HTMLDivElement>} className="text-4xl md:text-5xl font-bold mb-2">{display}</div>
      <div className="text-white/90">{label}</div>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal3D preset="zoomTwist">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { target: 150, suffix: '+', label: 'Projects Completed' },
              { target: 50,  suffix: '+', label: 'Happy Clients' },
              { target: 10,  suffix: '+', label: 'Years Experience' },
              { target: 24,  suffix: '/7', label: 'Support Available' },
            ].map((stat, index) => (
              <AnimatedStat key={stat.label} target={stat.target} suffix={stat.suffix} label={stat.label} index={index} />
            ))}
          </div>
        </ScrollReveal3D>
      </div>
    </section>
  );
}
