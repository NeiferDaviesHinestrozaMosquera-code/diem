import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Lock, Eye, Database, UserCheck, Bell,
  Globe, Trash2, Mail, ChevronDown, CheckCircle,
  AlertCircle, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getPrivacySections, getPrivacyMeta } from '@/services/supabase-privacy';
import type { PrivacySection, PrivacyMeta } from '@/services/supabase-privacy';

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Shield, Lock, Eye, Database, UserCheck, Bell,
  Globe, Trash2, Mail, CheckCircle, AlertCircle,
};

function getIcon(name: string): React.ElementType {
  return ICON_MAP[name] ?? Shield;
}

// ── AccordionSection ──────────────────────────────────────────────────────────
function AccordionSection({
  section,
  index,
}: {
  section: PrivacySection;
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);
  const Icon = getIcon(section.icon_name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center shrink-0`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm sm:text-base">{section.title}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-border space-y-4">
              {/* Body text */}
              {section.body_text && (
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {section.body_text}
                </p>
              )}

              {/* Items */}
              {section.items && section.items.length > 0 && (
                <div className="space-y-2">
                  {section.items.map((item, i) => (
                    item.label ? (
                      // Card-style item (label + desc)
                      <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40">
                        {item.icon
                          ? <span className="text-lg shrink-0">{item.icon}</span>
                          : <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        }
                        <div>
                          <span className="font-medium text-sm">{item.label}:</span>
                          <span className="text-sm text-muted-foreground ml-1">{item.desc}</span>
                        </div>
                      </div>
                    ) : (
                      // Bullet-style item (desc only)
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function PrivacyPolicy() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<PrivacySection[]>([]);
  const [meta, setMeta] = useState<PrivacyMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getPrivacySections(), getPrivacyMeta()])
      .then(([secs, m]) => {
        setSections(secs);
        setMeta(m);
      })
      .catch(() => setError('Could not load privacy policy content.'))
      .finally(() => setLoading(false));
  }, []);

  const lastUpdated  = meta?.last_updated  ?? 'January 19, 2026';
  const pageTitle    = meta?.page_title    ?? 'Your Privacy Matters to Us';
  const pageSubtitle = meta?.page_subtitle ?? 'We are committed to protecting your personal information and being transparent about how we collect, use, and share it.';

  return (
    <div className="min-h-screen pt-20">

      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Privacy Policy</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            {pageTitle.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {pageTitle.split(' ').slice(-2).join(' ')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            {pageSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Effective: {lastUpdated}
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {sections.length} sections
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              GDPR compliant
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Sticky quick-nav */}
      {!loading && sections.length > 0 && (
        <section className="sticky top-20 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {sections.map(({ id, icon_name, title }) => {
                const Icon = getIcon(icon_name);
                return (
                  <button
                    key={id}
                    onClick={() =>
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted/50 transition-colors text-xs font-medium whitespace-nowrap shrink-0"
                  >
                    <Icon className="w-3 h-3" />
                    {title.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Key commitments */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Shield,    title: 'We never sell your data', color: 'text-blue-500',   bg: 'bg-blue-500/10'   },
              { icon: Lock,      title: 'End-to-end encryption',   color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { icon: UserCheck, title: 'You control your data',   color: 'text-green-500',  bg: 'bg-green-500/10'  },
            ].map(({ icon: Icon, title, color, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/20"
              >
                <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-sm font-medium">{title}</p>
              </motion.div>
            ))}
          </div>

          {/* Loading / error / accordion */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Loading policy sections…</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-3">
              {sections.map((section, index) => (
                <div id={section.id} key={section.id}>
                  <AccordionSection section={section} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Shield className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Still have questions?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our team is here to clarify any concerns about your privacy.
              Reach out and we'll respond within 30 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-4">
              Last updated: {lastUpdated} · Digital Emporium
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}