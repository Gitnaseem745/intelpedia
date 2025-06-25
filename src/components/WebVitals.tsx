"use client";

import { useReportWebVitals } from 'next/web-vitals';

export default function WebVitals() {
  useReportWebVitals((metric) => {
    try {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric);
      }
      // In production, send to analytics without console logging
      // Example: analytics.track('Web Vital', metric);
    } catch (error) {
      // Silently handle any errors to avoid console noise
      if (process.env.NODE_ENV === 'development') {
        console.warn('Error reporting web vital:', error);
      }
    }
  });

  return null;
}
