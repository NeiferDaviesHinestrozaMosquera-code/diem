import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Code,
  Sparkles,
  Zap,
  Globe,
  ShoppingBag,
  Star,
  CheckCircle2,
  TrendingUp,
  Shield,
  Layers,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPublicSiteSettings, getTestimonials } from '@/services/index';
import type { SiteSettings, Testimonial } from '@/types';


// ─── HeroSlide (must match SiteSettings encoding) ────────────────────────────
interface HeroSlide {
  id:          string;
  title:       string;
  subtitle:    string;
  description: string;
  image:       string;
  gradient:    string;
}

/** Parse heroImages[] — each item may be a JSON-encoded HeroSlide or a plain URL */
function decodeHeroImages(heroImages: string[]): HeroSlide[] {
  return heroImages.map((raw, idx) => {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && 'id' in parsed) {
        return parsed as HeroSlide;
      }
    } catch { /* plain URL fallback */ }
    return {
      id:          `img-${idx}`,
      title:       '',
      subtitle:    '',
      description: '',
      image:       raw,
      gradient:    GRADIENTS[idx % GRADIENTS.length],
    };
  });
}

// ─── Fallback slides (se usan si Supabase no retorna datos aún) ────────────────
const FALLBACK_SLIDES = [
  {
    id: 1,
    title: 'Transform Your Digital Presence',
    subtitle: 'Innovative solutions for modern businesses',
    description: 'We create cutting-edge digital experiences that drive growth and engagement.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80',
    gradient: 'from-blue-600/90 to-purple-600/90',
  },
  {
    id: 2,
    title: 'AI-Powered Solutions',
    subtitle: 'Intelligent automation for your business',
    description: 'Leverage the power of artificial intelligence to streamline operations.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80',
    gradient: 'from-purple-600/90 to-pink-600/90',
  },
  {
    id: 3,
    title: 'E-Commerce Excellence',
    subtitle: 'Build your online empire',
    description: 'Complete e-commerce solutions that convert visitors into customers.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80',
    gradient: 'from-emerald-600/90 to-teal-600/90',
  },
];

const GRADIENTS = [
  'from-blue-600/90 to-purple-600/90',
  'from-purple-600/90 to-pink-600/90',
  'from-emerald-600/90 to-teal-600/90',
  'from-orange-600/90 to-red-600/90',
];

const features = [
  { icon: Code,       title: 'Web Development',  description: 'Custom websites built with modern technologies' },
  { icon: Sparkles,   title: 'AI Solutions',      description: 'Intelligent bots and automation systems' },
  { icon: Zap,        title: 'Fast Performance',  description: 'Optimized for speed and scalability' },
  { icon: Globe,      title: 'Global Reach',      description: 'Multi-language and international support' },
];

// ─── Value proposition items ──────────────────────────────────────────────────
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Home() {
  const [currentSlide, setCurrentSlide]     = useState(0);
  const [mousePosition, setMousePosition]   = useState({ x: 0, y: 0 });
  const [siteSettings, setSiteSettings]     = useState<SiteSettings | null>(null);
  const [testimonials, setTestimonials]     = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial]     = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const navigate     = useNavigate();
  const { t }        = useTranslation();

  // ── Fetch settings & testimonials ──────────────────────────────────────────
  useEffect(() => {
    getPublicSiteSettings()
      .then(setSiteSettings)
      .catch(console.error);

    getTestimonials()
      .then((data) => {
        setTestimonials(data);
        setTestimonialsLoading(false);
      })
      .catch(() => setTestimonialsLoading(false));
  }, []);

  // ── Build slides from DB or fallback ───────────────────────────────────────
  const slides = (() => {
    const raw = siteSettings?.heroImages ?? [];
    if (raw.length === 0) return FALLBACK_SLIDES;

    const decoded = decodeHeroImages(raw);

    // Map decoded slides → display format, filling empty fields with fallbacks
    return decoded.map((slide, idx) => ({
      id:          idx + 1,
      title:       slide.title       || siteSettings?.heroTitle    || FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].title,
      subtitle:    slide.subtitle    || siteSettings?.heroSubtitle || FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].subtitle,
      description: slide.description || FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].description,
      image:       slide.image       || FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].image,
      gradient:    slide.gradient    || GRADIENTS[idx % GRADIENTS.length],
    }));
  })();

  // ── Carousel auto-advance ──────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // ── Testimonials auto-advance ──────────────────────────────────────────────
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // ── Mouse parallax ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width  / 2) / 50,
          y: (e.clientY - rect.top  - rect.height / 2) / 50,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="min-h-screen">

      {/* ═══════════════════════════════════════════════════
          HERO CAROUSEL
      ═══════════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slides[currentSlide].image})`,
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
                transition: 'transform 0.3s ease-out',
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].gradient}`} />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-2xl"
              >
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-4"
                >
                  {slides[currentSlide].subtitle}
                </motion.span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-lg text-white/80 mb-8 max-w-lg">
                  {slides[currentSlide].description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      onClick={() => navigate('/quote')}
                      className="bg-white text-primary hover:bg-white/90"
                    >
                      {t('getStarted')}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate('/services')}
                      className="border-white/50 text-black hover:bg-black/10"
                    >
                      {t('learnMore')}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide ? 'bg-white w-6 h-3' : 'bg-white/40 w-3 h-3'
                }`}
              />
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-10 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl hidden lg:block"
          style={{ transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)` }}
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full hidden lg:block"
          style={{ transform: `translate(${mousePosition.x * -2}px, ${mousePosition.y * -2}px)` }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════════ */}
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
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
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
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          VALUE PROPOSITION
      ═══════════════════════════════════════════════════ */}
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
              <motion.div
                key={vp.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
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

      {/* ═══════════════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '150+', label: 'Projects Completed' },
              { value: '50+',  label: 'Happy Clients' },
              { value: '10+',  label: 'Years Experience' },
              { value: '24/7', label: 'Support Available' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════ */}
      {(testimonialsLoading || testimonials.length > 0) && (
        <section
          className="py-24 relative overflow-hidden"
          style={
            siteSettings?.testimonialsBackground
              ? {
                  backgroundImage: `url(${siteSettings.testimonialsBackground})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : {}
          }
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-sm font-semibold tracking-wide mb-4 uppercase">
                Client Stories
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                What Our Clients{' '}
                <span className="text-primary">Say</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Real results, real people. Here's what businesses like yours say about working with us.
              </p>
            </motion.div>

            {/* Loading skeleton */}
            {testimonialsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-8 rounded-3xl bg-card border border-border animate-pulse">
                    <div className="flex gap-1 mb-4">
                      {[1,2,3,4,5].map(s => (
                        <div key={s} className="w-4 h-4 rounded-full bg-muted" />
                      ))}
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-4/5" />
                      <div className="h-4 bg-muted rounded w-3/5" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted" />
                      <div className="space-y-1.5">
                        <div className="h-3 bg-muted rounded w-24" />
                        <div className="h-3 bg-muted rounded w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Desktop grid (≥md) */}
            {!testimonialsLoading && testimonials.length > 0 && (
              <>
                {/* Show up to 6 in a grid on md+ */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {testimonials.slice(0, 6).map((t, index) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      className="relative p-8 rounded-3xl bg-card border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Quote icon */}
                      <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />

                      <StarRating rating={t.rating} />

                      <p className="mt-4 mb-6 text-sm leading-relaxed text-muted-foreground flex-1">
                        "{t.content}"
                      </p>

                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        {t.avatar ? (
                          <img
                            src={t.avatar}
                            alt={t.clientName}
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {t.clientName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm">{t.clientName}</p>
                          <p className="text-xs text-muted-foreground">{t.company}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile carousel */}
                <div className="md:hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.4 }}
                      className="p-8 rounded-3xl bg-card border border-border"
                    >
                      <Quote className="w-8 h-8 text-primary/10 mb-3" />
                      <StarRating rating={testimonials[activeTestimonial].rating} />
                      <p className="mt-4 mb-6 text-sm leading-relaxed text-muted-foreground">
                        "{testimonials[activeTestimonial].content}"
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        {testimonials[activeTestimonial].avatar ? (
                          <img
                            src={testimonials[activeTestimonial].avatar}
                            alt={testimonials[activeTestimonial].clientName}
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {testimonials[activeTestimonial].clientName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm">{testimonials[activeTestimonial].clientName}</p>
                          <p className="text-xs text-muted-foreground">{testimonials[activeTestimonial].company}</p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Mobile dots */}
                  <div className="flex justify-center gap-2 mt-6">
                    {testimonials.slice(0, 6).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={`transition-all duration-300 rounded-full ${
                          i === activeTestimonial ? 'bg-primary w-6 h-2.5' : 'bg-muted w-2.5 h-2.5'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* View more link */}
                {testimonials.length > 6 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-8"
                  >
                    <Button variant="outline" onClick={() => navigate('/testimonials')}>
                      View all {testimonials.length} reviews
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════ */}
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
    </div>
  );
}