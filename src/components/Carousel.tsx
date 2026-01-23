import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'UI/UX Design Excellence',
    description: 'Modern web interfaces and high-fidelity prototyping focused on conversion and intuitive user journeys',
    icon: '🎨',
    gradient: 'from-blue-500/20 to-purple-500/20'
  },
  {
    id: 2,
    title: 'Cloud Architecture',
    description: 'Scalable serverless infrastructure and DevOps automation for enterprise platforms',
    icon: '☁️',
    gradient: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    id: 3,
    title: 'VFX Production',
    description: 'Advanced compositing, 3D environment design, and high-fidelity particles for cinematic media',
    icon: '🎬',
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    id: 4,
    title: 'Mobile Development',
    description: 'Native iOS and Android application development using Flutter or React Native for maximum reach',
    icon: '📱',
    gradient: 'from-green-500/20 to-emerald-500/20'
  },
  {
    id: 5,
    title: 'Cyber Security',
    description: 'Enterprise-grade security audits and protection. Vulnerability assessments and real-time monitoring',
    icon: '🛡️',
    gradient: 'from-red-500/20 to-orange-500/20'
  }
];

export const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <span className="text-primary text-sm font-medium">✨ FEATURED SERVICES</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Premium <span className="gradient-text">Digital Solutions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Curated high-performance digital solutions designed to elevate your brand and production quality
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Slide */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentIndex
                    ? 'opacity-100 translate-x-0'
                    : index < currentIndex
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className={`h-full bg-gradient-to-br ${slide.gradient} backdrop-blur-sm border border-border rounded-2xl p-12 flex flex-col justify-center items-center text-center relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-64 h-64 border border-primary/30 rounded-full" />
                    <div className="absolute bottom-10 left-10 w-48 h-48 border border-primary/30 rounded-full" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-8xl mb-6 transform hover:scale-110 transition-transform duration-300">
                      {slide.icon}
                    </div>
                    <h3 className="text-4xl font-bold text-foreground mb-4">
                      {slide.title}
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      {slide.description}
                    </p>
                    <button className="mt-8 px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50">
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group"
          >
            <ChevronLeft className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group"
          >
            <ChevronRight className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-12 h-3 bg-primary'
                    : 'w-3 h-3 bg-border hover:bg-primary/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isAutoPlaying ? '⏸ Pause Auto-play' : '▶ Resume Auto-play'}
            </button>
          </div>
        </div>

        {/* Service Cards Preview */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          {slides.slice(0, 3).map((slide) => (
            <div
              key={slide.id}
              className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10 cursor-pointer group"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {slide.icon}
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {slide.title}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {slide.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};