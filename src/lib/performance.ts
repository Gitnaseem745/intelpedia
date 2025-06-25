// Performance monitoring and optimization utilities
export const performanceUtils = {
  // Lazy load images when they come into viewport
  lazyLoadImages: () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  },

  // Preload critical resources
  preloadCriticalResources: () => {
    // Preload critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.as = 'style';
    criticalCSS.href = '/_next/static/css/app/globals.css';
    document.head.appendChild(criticalCSS);
  },

  // Monitor Core Web Vitals
  reportWebVitals: (metric: any) => {
    if (process.env.NODE_ENV === 'production') {
      console.log('Web Vital:', metric);
      // You can send this to your analytics service
    }
  }
};

// Initialize performance optimizations
if (typeof window !== 'undefined') {
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', performanceUtils.lazyLoadImages);
  } else {
    performanceUtils.lazyLoadImages();
  }
}
