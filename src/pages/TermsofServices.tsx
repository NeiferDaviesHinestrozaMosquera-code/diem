import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, CheckCircle, Settings, Shield, CreditCard,
  AlertTriangle, XCircle, Mail, ChevronDown, Loader2,
  Scale, BookOpen,
} from 'lucide-react';
import { getTermsMeta, getActiveTermsSections } from '@/services/index';
import type { TermsMeta, TermsSection } from '@/types';

// ─── Icon map ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  FileText, CheckCircle, Settings, Shield, CreditCard,
  AlertTriangle, XCircle, Mail, Scale, BookOpen,
};

function SectionIcon({ name, color }: { name: string; color: string }) {
  const Icon = ICON_MAP[name] ?? FileText;
  return <Icon className="w-6 h-6" style={{ color }} />;
}

// ─── Accordion item ───────────────────────────────────────────────────────────

function AccordionSection({
  section,
  index,
  isOpen,
  onToggle,
}: {
  section: TermsSection;
  index:   number;
  isOpen:  boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group border border-border rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-2xl"
        aria-expanded={isOpen}
      >
        {/* Color dot + icon */}
        <span
          className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${section.color}18` }}
        >
          <SectionIcon name={section.icon_name} color={section.color} />
        </span>

        <span className="flex-1 min-w-0">
          <span className="block text-base font-semibold text-foreground leading-tight">
            {section.title}
          </span>
          {!isOpen && (
            <span className="block text-sm text-muted-foreground mt-0.5 truncate">
              {section.body_text.slice(0, 80)}…
            </span>
          )}
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-muted-foreground"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 space-y-5">
              {/* Divider */}
              <div
                className="h-px w-full rounded-full"
                style={{ backgroundColor: `${section.color}30` }}
              />

              {/* Body */}
              {section.body_text && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.body_text}
                </p>
              )}

              {/* Items */}
              {section.items?.length > 0 && (
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex gap-3"
                    >
                      <span
                        className="mt-1 w-2 h-2 shrink-0 rounded-full"
                        style={{ backgroundColor: section.color }}
                      />
                      <span className="text-sm text-foreground/90 leading-relaxed">
                        {item.label && (
                          <strong className="font-medium text-foreground">
                            {item.label}:{' '}
                          </strong>
                        )}
                        {item.desc}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TermsOfService() {
  const [meta, setMeta]         = useState<TermsMeta | null>(null);
  const [sections, setSections] = useState<TermsSection[]>([]);
  const [loading, setLoading]   = useState(true);
  const [openId, setOpenId]     = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [m, s] = await Promise.all([getTermsMeta(), getActiveTermsSections()]);
        setMeta(m);
        setSections(s);
        if (s.length > 0) setOpenId(s[0].id); // open first by default
      } catch (err) {
        console.error('Error loading terms:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3D3068] via-[#5D4E8C] to-[#7B6CB3] text-white py-20 px-4">
        {/* Background decorations */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.08 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20"
          >
            <Scale className="w-8 h-8" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold leading-tight"
          >
            {meta?.page_title ?? 'Terms of Service'}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-4 text-lg text-white/75 max-w-xl mx-auto"
          >
            {meta?.page_subtitle}
          </motion.p>

          {meta?.last_updated && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm text-white/80 border border-white/15 backdrop-blur-sm"
            >
              <BookOpen className="w-4 h-4" />
              Last updated:{' '}
              {new Date(meta.last_updated).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </motion.p>
          )}
        </div>
      </section>

      {/* ── Content ── */}
      <section className="max-w-3xl mx-auto px-4 py-14 space-y-4">
        {sections.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No terms sections available.
          </p>
        ) : (
          sections.map((section, i) => (
            <AccordionSection
              key={section.id}
              section={section}
              index={i}
              isOpen={openId === section.id}
              onToggle={() => toggle(section.id)}
            />
          ))
        )}
      </section>

      {/* ── Contact footer ── */}
      {meta?.contact_email && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-4 pb-16"
        >
          <div className="rounded-2xl border border-border bg-card p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left shadow-sm">
            <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">
                Questions about these terms?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                If you have any questions or concerns, please reach out to our legal team.
              </p>
            </div>
            <a
              href={`mailto:${meta.contact_email}`}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact us
            </a>
          </div>
        </motion.section>
      )}
    </div>
  );
}