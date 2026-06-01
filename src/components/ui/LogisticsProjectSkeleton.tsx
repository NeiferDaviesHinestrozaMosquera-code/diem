import { motion } from 'framer-motion';
import { Plane, Ship, Truck, Package } from 'lucide-react';
import type { JSX } from 'react';

const icons: JSX.Element[] = [
  <Plane key="plane" className="w-12 h-12 text-primary/45" />,
  <Ship key="ship" className="w-12 h-12 text-primary/45" />,
  <Truck key="truck" className="w-12 h-12 text-primary/45" />,
  <Package key="package" className="w-12 h-12 text-primary/45" />,
];

interface LogisticsProjectSkeletonProps {
  /** Index used to cycle through logistics icons */
  index?: number;
}

export function LogisticsProjectSkeleton({ index = 0 }: LogisticsProjectSkeletonProps) {
  const selectedIcon = icons[index % icons.length];

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card flex flex-col">
      {/* Animated logistics icon area — replaces the image placeholder */}
      <div className="h-48 bg-muted/40 flex items-center justify-center relative overflow-hidden">
        {/* Subtle animated background line to simulate transit */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: index * 0.4 }}
          style={{ width: '50%' }}
        />

        {/* Main logistics icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.35, 0.75, 0.35],
            y: [0, -6, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.2,
          }}
        >
          {selectedIcon}
        </motion.div>
      </div>

      {/* Simulated card content */}
      <div className="p-5 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3.5 bg-muted rounded animate-pulse w-full" />
          <div className="h-3.5 bg-muted rounded animate-pulse w-5/6" />
        </div>
        {/* Technology tags skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-muted rounded-md w-16 animate-pulse" />
          <div className="h-6 bg-muted rounded-md w-14 animate-pulse" />
          <div className="h-6 bg-muted rounded-md w-12 animate-pulse" />
        </div>
        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 bg-muted rounded w-24 animate-pulse" />
          <div className="h-4 bg-muted rounded w-20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
