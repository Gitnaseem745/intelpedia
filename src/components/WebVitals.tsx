"use client";

import { useReportWebVitals } from 'next/web-vitals';

export default function WebVitals() {
  useReportWebVitals((metric) => {
    // Only log in development or send to analytics in production
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', metric);
    } else {
      // In production, you might want to send this to your analytics service
      // Example: analytics.track('Web Vital', metric);
    }
  });

  return null;
}
