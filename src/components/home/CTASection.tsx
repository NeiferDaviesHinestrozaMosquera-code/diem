import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { SiteSettings } from '@/types';

export function CTASection({ siteSettings }: { siteSettings: SiteSettings | null }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20 p-8 md:p-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                READY TO START YOUR PROJECT?
              </h3>
              <p className="text-muted-foreground">
                {siteSettings?.contactText ?? "Let's create something amazing together"}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={() => navigate('/quote')}
                className="bg-primary hover:bg-primary/90"
              >
                <ShoppingBag className="mr-2 w-4 h-4" />
                {t('requestQuote')}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
