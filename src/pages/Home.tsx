import { useState, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { getPublicSiteSettings, getTestimonials } from '@/services/index';
import type { SiteSettings, Testimonial } from '@/types';
import { SEO } from '@/components/Seo';

// Componentes importados de home/
import { HeroCarousel } from '@/components/home/HeroCarousel';
import type { HeroSlideData } from '@/components/home/HeroCarousel';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { ValueProposition } from '@/components/home/ValueProposition';
import { StatsSection } from '@/components/home/StatsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';

const GRADIENTS = [
  'from-blue-600/90 to-purple-600/90',
  'from-purple-600/90 to-pink-600/90',
  'from-emerald-600/90 to-teal-600/90',
  'from-orange-600/90 to-red-600/90',
];

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

function decodeHeroImages(heroImages: string[]): HeroSlideData[] {
  return heroImages.map((raw, idx) => {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && 'id' in parsed) {
        return parsed as HeroSlideData;
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

export function Home() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 250]);

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

  const slides = (() => {
    const raw = siteSettings?.heroImages ?? [];
    if (raw.length === 0) return FALLBACK_SLIDES;

    const decoded = decodeHeroImages(raw);

    return decoded.map((slide, idx) => ({
      id:          slide.id,
      title:       slide.title       || siteSettings?.heroTitle    || FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].title,
      subtitle:    slide.subtitle    || siteSettings?.heroSubtitle || FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].subtitle,
      description: slide.description || FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].description,
      image:       slide.image       || FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].image,
      gradient:    slide.gradient    || GRADIENTS[idx % GRADIENTS.length],
    }));
  })();

  return (
    <div className="min-h-screen">
      <SEO url="/" />
      
      <HeroCarousel slides={slides} yBg={yBg} />
      <FeaturesSection siteSettings={siteSettings} />
      <ValueProposition />
      <StatsSection />
      <TestimonialsSection 
        testimonials={testimonials} 
        testimonialsLoading={testimonialsLoading} 
        siteSettings={siteSettings} 
      />
      <CTASection siteSettings={siteSettings} />
    </div>
  );
}