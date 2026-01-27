import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Slider.css';

interface Slide {
  image: string;
  title: string;
  description: string;
  link?: string;
}

interface SliderProps {
  slides: Slide[];
}

const Slider = ({ slides }: SliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="slider-container">
      <div className="slider-wrapper">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''} ${
              index < currentSlide ? 'prev' : ''
            } ${index > currentSlide ? 'next' : ''}`}
          >
            <div className="slide-content">
              <div className="slide-image">
                <img src={slide.image} alt={slide.title} />
              </div>
              <div className="slide-text">
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
                {slide.link && (
                  <a href={slide.link} className="slide-link">
                    Ver más →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="slider-btn prev-btn" onClick={prevSlide} aria-label="Slide anterior">
        <ChevronLeft />
      </button>
      <button className="slider-btn next-btn" onClick={nextSlide} aria-label="Siguiente slide">
        <ChevronRight />
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
