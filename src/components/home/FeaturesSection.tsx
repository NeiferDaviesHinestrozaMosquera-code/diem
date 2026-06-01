import { motion } from 'framer-motion';
import { ScrollReveal3D } from '@/components/ui/ScrollReveal3D';
import { Code, Sparkles, Zap, Globe } from 'lucide-react';
import type { SiteSettings } from '@/types';

const features = [
  { icon: Code,       title: 'Web Development',  description: 'Custom websites built with modern technologies' },
  { icon: Sparkles,   title: 'AI Solutions',      description: 'Intelligent bots and automation systems' },
  { icon: Zap,        title: 'Fast Performance',  description: 'Optimized for speed and scalability' },
  { icon: Globe,      title: 'Global Reach',      description: 'Multi-language and international support' },
];

export function FeaturesSection({ siteSettings }: { siteSettings: SiteSettings | null }) {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose{' '}
            <span className="text-primary">
              {siteSettings?.siteName ?? 'Digital Emporium'}
            </span>
            ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {siteSettings?.servicesText ?? 'We combine innovation with expertise to deliver exceptional results'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <ScrollReveal3D key={feature.title} preset="flipUp">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            </ScrollReveal3D>
          ))}
        </div>
      </div>
    </section>
  );
}
