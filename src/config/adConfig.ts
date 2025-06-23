// Ad Configuration - Centralized ad management
export const adConfig = {
  // Ad Network Settings
  networks: {
    google: {
      enabled: true,
      publisherId: "ca-pub-XXXXXXXXXX", // Replace with your AdSense ID
      testMode: process.env.NODE_ENV === "development",
    },
    medianet: {
      enabled: false,
      siteId: "XXXXXXXXXX",
    },
    // Add other ad networks here
  },

  // Ad Placement Configuration
  placements: {
    topBanner: {
      enabled: true,
      sizes: [[728, 90], [970, 90], [320, 50]], // Responsive sizes
      adUnitId: "/XXXXXXX/top-banner",
      lazy: false, // Load immediately for above-fold
    },
    sidebarLeft: {
      enabled: true,
      sizes: [[160, 600], [120, 600]],
      adUnitId: "/XXXXXXX/sidebar-left",
      lazy: true,
    },
    sidebarRight: {
      enabled: true,
      sizes: [[160, 600], [300, 600]],
      adUnitId: "/XXXXXXX/sidebar-right",
      lazy: true,
    },
    inContent: {
      enabled: true,
      sizes: [[336, 280], [300, 250], [728, 90]],
      adUnitId: "/XXXXXXX/in-content",
      lazy: true,
    },
    preComments: {
      enabled: true,
      sizes: [[728, 90], [320, 50]],
      adUnitId: "/XXXXXXX/pre-comments",
      lazy: true,
    },
    mobileBottom: {
      enabled: true,
      sizes: [[320, 100], [320, 50]],
      adUnitId: "/XXXXXXX/mobile-bottom",
      lazy: true,
      mobileOnly: true,
    },
  },

  // Responsive Breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
  },

  // Performance Settings
  performance: {
    lazyLoadOffset: "200px", // Start loading when 200px away
    refreshInterval: 30000, // Refresh ads every 30 seconds (if enabled)
    maxAdsPerPage: 6, // Limit total ads for better UX
  },

  // Content Settings
  contentRules: {
    minWordsBeforeAd: 300, // Minimum words before in-content ad
    maxAdsInContent: 2, // Maximum ads within content
    adToContentRatio: 0.3, // Max 30% ad content
  },
};

// Ad Size Mappings for different devices
export const adSizeMap = {
  banner: {
    mobile: [320, 50],
    tablet: [728, 90],
    desktop: [970, 90],
  },
  rectangle: {
    mobile: [300, 250],
    tablet: [336, 280],
    desktop: [336, 280],
  },
  sidebar: {
    mobile: [300, 250], // Fallback for mobile (shouldn't be used)
    tablet: [160, 600],
    desktop: [160, 600],
  },
  square: {
    mobile: [250, 250],
    tablet: [250, 250],
    desktop: [250, 250],
  },
};

// Ad Labels for compliance
export const adLabels = {
  en: {
    advertisement: "Advertisement",
    sponsored: "Sponsored",
    promotion: "Promotion",
  },
  // Add other languages as needed
};

export default adConfig;
