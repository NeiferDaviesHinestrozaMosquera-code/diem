import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Configuramos físicas de resorte suaves para el rastro
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = () => setIsHovered(true);
    const handleElementLeave = () => setIsHovered(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    // Añadir listeners a enlaces y botones para el efecto hover
    const interactables = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', handleElementHover);
      el.addEventListener('mouseleave', handleElementLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', handleElementHover);
        el.removeEventListener('mouseleave', handleElementLeave);
      });
    };
  }, [cursorX, cursorY, isVisible]);

  // Si estamos en un dispositivo móvil (pantallas táctiles), no renderizamos el cursor
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <motion.div
        className="w-full h-full border border-white rounded-full flex items-center justify-center bg-transparent"
        animate={{
          scale: isHovered ? 1.5 : 1,
          backgroundColor: isHovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="w-1 h-1 bg-white rounded-full"
          animate={{
            scale: isHovered ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </motion.div>
  );
}
