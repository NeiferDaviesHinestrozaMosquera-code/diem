import { useLanguage } from './hooks/useLanguage';
import { useTheme } from './hooks/useTheme';
import { useScrollAnimation, useStaggerAnimation } from './hooks/useScrollAnimation';
import ThemeLanguageSelector from './components/ThemeLanguageSelector';
import SectionTitle from './components/SectionTitle';
import Slider from './components/Slider';
import Card from './components/Card';
import CustomCursor from './components/CustomCursor';
import './App.css';

interface SlideData {
  image: string;
  title: string;
  description: string;
  link?: string;
}

interface ServiceData {
  image: string;
  title: string;
  description: string;
}

function App() {
  const { language, changeLanguage, t } = useLanguage();
  const { theme, changeTheme } = useTheme();

  // Hooks de animación
  const [heroRef, heroVisible] = useScrollAnimation({ threshold: 0.2 });
  const [servicesRef, servicesVisible] = useScrollAnimation({ threshold: 0.1 });
  
  // Stagger animation para las cards
  const [setCardRef, visibleCards] = useStaggerAnimation(3);

  // Datos de ejemplo para el slider
  const slides: SlideData[] = [
    {
      image: '/images/slide1.jpg',
      title: 'Desarrollo Web Moderno',
      description: 'Creamos sitios web responsivos y aplicaciones web progresivas que destacan.',
      link: '#services'
    },
    {
      image: '/images/slide2.jpg',
      title: 'Diseño UI/UX',
      description: 'Interfaces intuitivas y experiencias de usuario excepcionales.',
      link: '#portfolio'
    },
    {
      image: '/images/slide3.jpg',
      title: 'Marketing Digital',
      description: 'Estrategias efectivas para hacer crecer tu presencia en línea.',
      link: '#contact'
    }
  ];

  const services: ServiceData[] = [
    {
      image: '/images/web-dev.jpg',
      title: 'Desarrollo Web',
      description: 'Creamos sitios web modernos, rápidos y seguros utilizando las últimas tecnologías.'
    },
    {
      image: '/images/design.jpg',
      title: 'Diseño UI/UX',
      description: 'Diseñamos interfaces hermosas e intuitivas que enamoran a tus usuarios.'
    },
    {
      image: '/images/marketing.jpg',
      title: 'Marketing Digital',
      description: 'Estrategias de marketing digital que generan resultados medibles.'
    }
  ];

  return (
    <div className="app">
      {/* Cursor personalizado */}
      <CustomCursor />

      {/* Header con selectores */}
      <header className="header glass">
        <div className="container">
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">Digital Emporium</span>
          </div>

          <nav className="nav">
            <a href="#services">{t('nav.services')}</a>
            <a href="#portfolio">{t('nav.portfolio')}</a>
            <a href="#about">{t('nav.about')}</a>
            <a href="#blog">{t('nav.blog')}</a>
          </nav>

          <div className="header-actions">
            <ThemeLanguageSelector
              language={language}
              changeLanguage={changeLanguage}
              theme={theme}
              changeTheme={changeTheme}
            />
            <button className="cta-button btn-ripple">{t('nav.getQuote')}</button>
          </div>
        </div>
      </header>

      {/* Hero Section con Slider */}
      <section 
        ref={heroRef}
        className={`hero ${heroVisible ? 'animate-fadeInUp' : ''}`}
      >
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title responsive-heading">
              {t('home.title')}{' '}
              <span className="highlight animate-gradient">
                {t('home.titleHighlight')}
              </span>{' '}
              {t('home.titleEnd')}
            </h1>
            <p className="hero-subtitle">{t('home.subtitle')}</p>
          </div>

          <div className="parallax-container">
            <Slider slides={slides} />
          </div>
        </div>
      </section>

      {/* Services Section con animaciones stagger */}
      <section 
        id="services" 
        ref={servicesRef}
        className="section"
      >
        <SectionTitle
          title={t('services.title')}
          subtitle={t('services.subtitle')}
        />
        <div className="container">
          <div className="cards-grid">
            {services.map((service, index) => (
              <div
                key={index}
                ref={setCardRef(index)}
                className={`stagger-item card-hover img-zoom ${
                  visibleCards.has(index) ? 'animate' : ''
                }`}
              >
                <Card
                  image={service.image}
                  title={service.title}
                  description={service.description}
                  link="#services"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <SectionTitle
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
        />
        <div className="container">
          <div className="cards-grid">
            {/* Aquí irían tus proyectos con la misma estructura de animación */}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <SectionTitle
          title={t('about.title')}
          subtitle={t('about.subtitle')}
        />
        <div className="container">
          {/* Aquí iría tu contenido de about */}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <SectionTitle
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
        />
        <div className="container">
          <div className="contact-cards">
            <div className="card-hover">
              <Card
                icon={() => <span style={{ fontSize: '3rem' }}>📧</span>}
                title={t('home.emailUs')}
                description="hello@digitalemporium.com"
                link="mailto:hello@digitalemporium.com"
              />
            </div>
            <div className="card-hover">
              <Card
                icon={() => <span style={{ fontSize: '3rem' }}>📞</span>}
                title={t('home.callUs')}
                description="+1 (555) 000-1234"
                link="tel:+15550001234"
              />
            </div>
            <div className="card-hover">
              <Card
                icon={() => <span style={{ fontSize: '3rem' }}>📍</span>}
                title={t('home.visitUs')}
                description="123 Tech Lane, Silicon Valley"
                link="https://maps.google.com"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Request Quote Section */}
      <section id="quote" className="section">
        <SectionTitle
          title={t('quote.title')}
          subtitle={t('quote.subtitle')}
        />
        <div className="container">
          <div className="quote-card animate-pulse-glow">
            <h3>{t('home.readyTitle')}</h3>
            <p>{t('home.readySubtitle')}</p>
            <button className="cta-button large btn-ripple">
              {t('home.requestQuote')} →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="logo">
              <span className="logo-icon">🎯</span>
              <span className="logo-text">Digital Emporium</span>
            </div>
            <p>© 2024 Digital Emporium Agency. {t('footer.rights')}</p>
            
            {/* Links adicionales del footer */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#services" style={{ color: 'inherit', textDecoration: 'none' }}>
                {t('nav.services')}
              </a>
              <a href="#portfolio" style={{ color: 'inherit', textDecoration: 'none' }}>
                {t('nav.portfolio')}
              </a>
              <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>
                {t('nav.about')}
              </a>
              <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>
                {t('contact.title')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
