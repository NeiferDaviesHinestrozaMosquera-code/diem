import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type Preset = 'flipUp' | 'rotateIn' | 'zoomTwist' | 'tiltLeft' | 'tiltRight';

interface ScrollReveal3DProps {
  children: React.ReactNode;
  preset?: Preset;
  className?: string;
}

const presetConfig = {
  flipUp: {
    rotateX: { input: [0, 0.5, 1], output: [35, 0, 0] },
    rotateY: { input: [0, 1], output: [0, 0] },
    scale:   { input: [0, 0.5, 1], output: [0.85, 1, 1] },
    y:       { input: [0, 0.5, 1], output: [80, 0, 0] },
  },
  rotateIn: {
    rotateX: { input: [0, 0.5, 1], output: [0, 0, 0] },
    rotateY: { input: [0, 0.5, 1], output: [-15, 0, 0] },
    scale:   { input: [0, 0.5, 1], output: [0.9, 1, 1] },
    y:       { input: [0, 0.5, 1], output: [60, 0, 0] },
  },
  zoomTwist: {
    rotateX: { input: [0, 0.4, 1], output: [10, 0, 0] },
    rotateY: { input: [0, 0.4, 1], output: [10, 0, 0] },
    scale:   { input: [0, 0.4, 1], output: [0.7, 1, 1] },
    y:       { input: [0, 0.4, 1], output: [100, 0, 0] },
  },
  tiltLeft: {
    rotateX: { input: [0, 0.5, 1], output: [0, 0, 0] },
    rotateY: { input: [0, 0.5, 1], output: [20, 0, 0] },
    scale:   { input: [0, 0.5, 1], output: [0.92, 1, 1] },
    y:       { input: [0, 0.5, 1], output: [50, 0, 0] },
  },
  tiltRight: {
    rotateX: { input: [0, 0.5, 1], output: [0, 0, 0] },
    rotateY: { input: [0, 0.5, 1], output: [-20, 0, 0] },
    scale:   { input: [0, 0.5, 1], output: [0.92, 1, 1] },
    y:       { input: [0, 0.5, 1], output: [50, 0, 0] },
  },
};

export function ScrollReveal3D({
  children,
  preset = 'flipUp',
  className = '',
}: ScrollReveal3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const config = presetConfig[preset];

  const rotateX = useTransform(scrollYProgress, config.rotateX.input, config.rotateX.output);
  const rotateY = useTransform(scrollYProgress, config.rotateY.input, config.rotateY.output);
  const scale   = useTransform(scrollYProgress, config.scale.input,   config.scale.output);
  const y       = useTransform(scrollYProgress, config.y.input,       config.y.output);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);

  return (
    <div ref={ref} className={className} style={{ perspective: 1200 }}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          y,
          opacity,
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
