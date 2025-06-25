'use client';
import dynamic from "next/dynamic";

// Dynamically import non-critical components to reduce initial bundle size
export const DynamicTagCard = dynamic(() => import("@/components/TagCard").then(mod => ({ default: mod.TagCard })), {
  loading: () => <div className="animate-pulse bg-muted/50 rounded-xl h-32"></div>
});

// Dynamically import Web Vitals for production monitoring
export const DynamicWebVitals = dynamic(() => import('@/components/WebVitals'), { ssr: false });
