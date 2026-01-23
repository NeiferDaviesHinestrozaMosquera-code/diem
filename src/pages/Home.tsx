import { HeroSection } from '@/components/sections/HeroSection';
import { Carousel } from '@/components/Carousel';
import { useParallax } from '@/hooks/useParallax';
import { Link } from 'react-router-dom';

export const Home = () => {
  const parallaxOffset = useParallax(0.5);

  return (
    <div className="relative">
      {/* Hero Section con efectos parallax */}
      <HeroSection />

      {/* Carousel - Componente existente restaurado */}
      <Carousel />

      {/* Sección de características con parallax */}
      <section 
        className="py-20 relative"
        style={{
          transform: `translateY(${parallaxOffset * 0.3}px)`,
        }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="gradient-text">Digital Emporium</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We combine cutting-edge technology with creative excellence to deliver exceptional digital experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Optimized performance for the best user experience',
                stat: '99.9%',
                label: 'Uptime'
              },
              {
                icon: '🎨',
                title: 'Beautiful Design',
                description: 'Stunning interfaces that users love',
                stat: '500+',
                label: 'Projects'
              },
              {
                icon: '🔒',
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security for your peace of mind',
                stat: '100%',
                label: 'Secure'
              },
              {
                icon: '🚀',
                title: '24/7 Support',
                description: 'Round-the-clock assistance whenever you need it',
                stat: '24/7',
                label: 'Available'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 card-hover"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                
                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-primary">{feature.stat}</span>
                    <span className="text-muted-foreground text-sm mb-1">{feature.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section con parallax */}
      <section 
        className="py-20 relative"
        style={{
          transform: `translateY(${parallaxOffset * 0.2}px)`,
        }}
      >
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Projects Completed', change: '+15%' },
              { value: '1.2k+', label: 'Happy Clients', change: '+10%' },
              { value: '350+', label: 'VFX Assets', change: '+20%' },
              { value: '98%', label: 'Client Satisfaction', change: '+5%' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10 text-center"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1 + 0.3}s both`
                }}
              >
                <p className="text-4xl font-bold text-foreground mb-2">{stat.value}</p>
                <p className="text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-green-500 text-sm font-medium">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section con espacio adicional */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join dozens of high-growth companies that trust Digital Emporium with their digital presence
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/quote">
                <button className="btn-primary">
                  Get Started
                </button>
              </Link>
              <Link to="/projects">
                <button className="btn-secondary">
                  View Portfolio
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};