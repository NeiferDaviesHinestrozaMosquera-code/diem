import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, animate } from 'framer-motion';

interface UseCountUpOptions {
  /** Target value to count up to */
  target: number;
  /** Duration in seconds (default: 2) */
  duration?: number;
  /** Suffix to append (e.g. '+', '%') */
  suffix?: string;
  /** Prefix to prepend (e.g. '$') */
  prefix?: string;
  /** Whether to use decimals */
  decimals?: number;
}

/**
 * Custom hook for animated count-up numbers.
 * Triggers when the element enters the viewport.
 *
 * Usage:
 * ```tsx
 * const { ref, display } = useCountUp({ target: 150, suffix: '+' });
 * return <span ref={ref}>{display}</span>;
 * ```
 */
export function useCountUp({
  target,
  duration = 2,
  suffix = '',
  prefix = '',
  decimals = 0,
}: UseCountUpOptions) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, target, {
      duration,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate: (latest) => {
        const formatted = decimals > 0
          ? latest.toFixed(decimals)
          : Math.round(latest).toString();
        setDisplay(`${prefix}${formatted}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [isInView, target, duration, suffix, prefix, decimals, motionValue]);

  return { ref, display, isInView };
}
