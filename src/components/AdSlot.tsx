"use client";
import React from "react";

interface AdSlotProps {
  size: "banner" | "rectangle" | "square" | "sidebar" | "mobile" | "leaderboard";
  position?: string;
  className?: string;
  children?: React.ReactNode;
}

const adSizes = {
  banner: { width: "728×90", height: "h-[90px] md:h-[120px]" },
  leaderboard: { width: "970×90", height: "h-[90px] md:h-[120px]" },
  rectangle: { width: "336×280", height: "h-[280px]" },
  square: { width: "250×250", height: "h-[250px]" },
  sidebar: { width: "160×600", height: "h-[600px]" },
  mobile: { width: "320×100", height: "h-[100px]" },
};

export const AdSlot: React.FC<AdSlotProps> = ({ 
  size, 
  position = "content", 
  className = "",
  children 
}) => {
  const sizeConfig = adSizes[size];
  
  // In production, replace this placeholder with actual ad code
  const renderAdContent = () => {
    if (children) {
      return children;
    }
    
    // Placeholder for development - replace with actual ad networks
    return (
      <div className="text-center">
        <div className="mb-2">📺</div>
        <div className="font-medium">{position} Ad</div>
        <div className="text-xs opacity-60">{sizeConfig.width}</div>
      </div>
    );
  };

  return (
    <div 
      className={`
        w-full 
        ${sizeConfig.height} 
        bg-gray-100 
        dark:bg-gray-800 
        rounded-lg 
        flex 
        items-center 
        justify-center 
        text-gray-500 
        dark:text-gray-400 
        text-sm 
        border 
        border-gray-200 
        dark:border-gray-700
        ${className}
      `}
      data-ad-size={size}
      data-ad-position={position}
    >
      {renderAdContent()}
    </div>
  );
};

// Specific ad components for common placements
export const TopBannerAd: React.FC<{ className?: string }> = ({ className }) => (
  <AdSlot size="banner" position="top-banner" className={className} />
);

export const SidebarAd: React.FC<{ className?: string }> = ({ className }) => (
  <AdSlot size="sidebar" position="sidebar" className={className} />
);

export const InContentAd: React.FC<{ className?: string }> = ({ className }) => (
  <AdSlot size="rectangle" position="in-content" className={className} />
);

export const MobileAd: React.FC<{ className?: string }> = ({ className }) => (
  <AdSlot size="mobile" position="mobile-bottom" className={className} />
);

export const SquareAd: React.FC<{ className?: string }> = ({ className }) => (
  <AdSlot size="square" position="sidebar-square" className={className} />
);

// Hook for ad visibility tracking (useful for analytics)
export const useAdTracking = (adId: string) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Track ad visibility
            console.log(`Ad ${adId} is visible`);
            // Here you can send analytics data
          }
        });
      },
      { threshold: 0.5 }
    );

    const adElement = document.querySelector(`[data-ad-id="${adId}"]`);
    if (adElement) {
      observer.observe(adElement);
    }

    return () => observer.disconnect();
  }, [adId]);
};
