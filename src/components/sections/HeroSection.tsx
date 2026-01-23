import { useParallax, useMouseParallax } from '../../hooks/useParallax';

export const HeroSection = () => {
  const parallaxOffset = useParallax(0.3);
  const mousePosition = useMouseParallax(25);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated background elements */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Geometric shapes */}
      <div 
        className="absolute top-20 right-20 w-64 h-64 opacity-10"
        style={{
          transform: `translateY(${parallaxOffset}px) rotate(${parallaxOffset * 0.1}deg)`,
        }}
      >
        <div className="w-full h-full border border-blue-500/30 transform rotate-45" />
      </div>

      <div 
        className="absolute bottom-40 left-20 w-48 h-48 opacity-10"
        style={{
          transform: `translateY(${-parallaxOffset * 0.5}px)`,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-blue-500/30 fill-none">
          <circle cx="50" cy="50" r="45" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="35" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="25" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div 
          className="max-w-4xl mx-auto text-center"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
            transition: 'transform 0.2s ease-out'
          }}
        >
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
            <span className="text-blue-400 text-sm font-medium">✨ NEW: AI INTEGRATION ENGINE</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent leading-tight">
            Next-gen <span className="text-blue-400">Digital</span><br />Services
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Experience high-end visual effects and premium tech services in our modern digital marketplace. Built for creators by creators.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50">
              Explore Marketplace
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all duration-300 border border-slate-700">
              View Reel
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto">
            {[
              { label: 'Projects Completed', value: '500+', change: '+15%' },
              { label: 'Happy Clients', value: '1.2k+', change: '+10%' },
              { label: 'VFX Assets', value: '350+', change: '+20%' },
              { label: 'Support Availability', value: '24/7', status: 'Online' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className={`text-xs ${stat.change ? 'text-green-400' : 'text-blue-400'}`}>
                  {stat.change || stat.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-blue-500/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-500 rounded-full mt-2 animate-pulse" />
        </div>
      </div>

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
    </section>
  );
};