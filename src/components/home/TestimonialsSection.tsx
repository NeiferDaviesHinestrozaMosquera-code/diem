import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { SiteSettings, Testimonial } from '@/types';

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

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  testimonialsLoading: boolean;
  siteSettings: SiteSettings | null;
}

export function TestimonialsSection({ testimonials, testimonialsLoading, siteSettings }: TestimonialsSectionProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (!testimonialsLoading && testimonials.length === 0) {
    return null; // Do not render if there are no testimonials and we finished loading
  }

  return (
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
                        width={44}
                        height={44}
                        loading="lazy"
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
                        width={44}
                        height={44}
                        loading="lazy"
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
              <div className="flex justify-center gap-3 mt-6" role="tablist" aria-label="Testimonios">
                {testimonials.slice(0, 6).map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === activeTestimonial}
                    aria-label={`Testimonio ${i + 1}`}
                    onClick={() => setActiveTestimonial(i)}
                    className={`transition-all duration-300 rounded-full min-w-[12px] min-h-[12px] p-1 ${
                      i === activeTestimonial ? 'bg-primary w-6 h-3' : 'bg-muted w-3 h-3'
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
  );
}
