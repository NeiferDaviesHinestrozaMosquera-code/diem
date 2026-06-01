import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionValue } from 'framer-motion';
import { TextReveal } from '@/components/ui/TextReveal';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface HeroSlideData {
  id: string | number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gradient: string;
}

interface HeroCarouselProps {
  slides: HeroSlideData[];
  yBg: MotionValue<number>;
}

export function HeroCarousel({ slides, yBg }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ── Carousel auto-advance ──────────────────────────────────────────────────
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

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

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.length > 0 && (
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <motion.img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title || 'Hero image'}
              width={1200}
              height={675}
              sizes="100vw"
              fetchPriority={currentSlide === 0 ? "high" : "auto"}
              loading={currentSlide === 0 ? "eager" : "lazy"}
              decoding={currentSlide === 0 ? "sync" : "async"}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
                transition: 'transform 0.3s ease-out',
                y: yBg
              }}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].gradient}`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            {slides.length > 0 && (
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
                  className="inline-block px-4 py-2 bg-white/25 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4"
                >
                  {slides[currentSlide].subtitle}
                </motion.span>
                <TextReveal 
                  text={slides[currentSlide].title} 
                  className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" 
                />
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/90 mb-8 max-w-lg"
                >
                  {slides[currentSlide].description}
                </motion.p>
                <div className="flex flex-wrap gap-4">
                  <MagneticButton>
                    <Button
                      size="lg"
                      onClick={() => navigate('/quote')}
                      className="bg-white text-primary hover:bg-white/90 shadow-xl"
                    >
                      {t('getStarted')}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </MagneticButton>
                  <MagneticButton>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate('/services')}
                      className="border-white text-white hover:bg-white/10"
                    >
                      {t('learnMore')}
                    </Button>
                  </MagneticButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            aria-label="Slide anterior"
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex gap-2" role="tablist" aria-label="Slides del carrusel">
            {slides.map((_, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={index === currentSlide}
                aria-label={`Ir al slide ${index + 1}`}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full min-w-[12px] min-h-[12px] ${
                  index === currentSlide ? 'bg-white w-6 h-3' : 'bg-white/40 w-3 h-3'
                }`}
              />
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            aria-label="Slide siguiente"
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      )}

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
  );
}
