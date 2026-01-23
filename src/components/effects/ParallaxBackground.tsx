import { useMouseParallax } from '@/hooks/useParallax';

export const ParallaxBackground = () => {
  const mousePosition = useMouseParallax(25);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Dot Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-10" />
      
      {/* Animated Gradient Blobs */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-glow"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />
      
      <div 
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-glow"
        style={{
          transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          transition: 'transform 0.3s ease-out',
          animationDelay: '1s'
        }}
      />
      
      <div 
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-glow"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          transition: 'transform 0.3s ease-out',
          animationDelay: '2s'
        }}
      />

      {/* Geometric Shapes */}
      <div 
        className="absolute top-20 right-20 w-64 h-64 opacity-5"
        style={{
          transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px) rotate(${mousePosition.x * 0.1}deg)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="w-full h-full border border-primary/30 transform rotate-45" />
      </div>

      <div 
        className="absolute bottom-40 left-20 w-48 h-48 opacity-5"
        style={{
          transform: `translate(${-mousePosition.x * 0.2}px, ${-mousePosition.y * 0.2}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary/30 fill-none">
          <circle cx="50" cy="50" r="45" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="35" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="25" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 noise-texture" />
    </div>
  );
};