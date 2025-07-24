# Ad Integration Guide

This blog is now fully optimized for ad integration with a responsive, future-proof layout. Here's how to integrate different ad networks:

## 🎯 Ad Placement Strategy

### Desktop Layout (1024px+)
- **Left Sidebar**: 160×600 Skyscraper + 250×250 Square
- **Right Sidebar**: 160×600 Skyscraper + 300×200 Rectangle  
- **Top Banner**: 728×90 or 970×90 Leaderboard
- **In-Content**: 336×280 Rectangle after article
- **Pre-Comments**: 728×90 Banner before comments

### Mobile Layout (< 1024px)
- **Top Banner**: 320×50 Mobile Banner
- **In-Content**: 300×250 Rectangle
- **Bottom**: 320×100 Mobile Banner

## 🔧 Quick Integration

### 1. Google AdSense
```typescript
// Update src/config/adConfig.ts
export const adConfig = {
  networks: {
    google: {
      enabled: true,
      publisherId: "ca-pub-YOUR-ID-HERE",
      testMode: false,
    }
  }
};
```

```jsx
// Replace placeholder in AdSlot.tsx
import { AdSlot } from "@/components/AdSlot";

<AdSlot size="banner" position="top">
  <ins className="adsbygoogle"
       style={{display:"block"}}
       data-ad-client="ca-pub-YOUR-ID"
       data-ad-slot="1234567890"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</AdSlot>
```

### 2. Media.net
```jsx
<AdSlot size="rectangle" position="content">
  <div id="123456789">
    {/* Media.net ad code */}
  </div>
</AdSlot>
```

### 3. Custom Ad Networks
```jsx
<AdSlot size="sidebar" position="right">
  {/* Your custom ad code here */}
  <script async src="your-ad-network.js"></script>
</AdSlot>
```

## 📱 Responsive Features

### Automatic Size Adaptation
- Ads automatically resize based on screen size
- Mobile-specific ad units for better performance
- Sidebar ads hidden on mobile to maintain readability

### Performance Optimizations
- Lazy loading for below-fold ads
- Intersection Observer for visibility tracking
- Minimal layout shift with fixed ad containers

## 🎨 Customization

### Ad Styling
```css
/* Custom ad styles in src/styles/ads.css */
.ad-container {
  margin: 2rem 0;
  border-radius: 8px;
  /* Add your custom styling */
}
```

### Ad Configuration
```typescript
// src/config/adConfig.ts
export const adConfig = {
  placements: {
    topBanner: {
      enabled: true,
      sizes: [[728, 90], [970, 90]],
      lazy: false, // Load immediately
    },
    // Configure other placements...
  }
};
```

## 🔍 Available Ad Components

### Pre-built Components
```jsx
import { 
  TopBannerAd,
  SidebarAd, 
  InContentAd,
  MobileAd,
  SquareAd 
} from "@/components/AdSlot";

// Use anywhere in your app
<TopBannerAd />
<SidebarAd />
<InContentAd />
```

### Custom Ad Slots
```jsx
import { AdSlot } from "@/components/AdSlot";

<AdSlot 
  size="rectangle" 
  position="custom"
  className="my-custom-class"
>
  {/* Your ad code */}
</AdSlot>
```

## 📊 Analytics & Tracking

### Built-in Visibility Tracking
```jsx
import { useAdTracking } from "@/components/AdSlot";

function MyComponent() {
  useAdTracking("unique-ad-id");
  
  return (
    <AdSlot data-ad-id="unique-ad-id">
      {/* Ad content */}
    </AdSlot>
  );
}
```

### Performance Monitoring
- Automatic viewport tracking
- Load time measurements
- Revenue optimization suggestions

## 🛡️ Compliance Features

### GDPR/CCPA Ready
- Consent management integration points
- Privacy-compliant lazy loading
- User preference respect

### Ad Labeling
```jsx
<AdSlot size="banner">
  <div className="ad-label">Advertisement</div>
  {/* Ad content */}
</AdSlot>
```

## 🚀 Advanced Features

### A/B Testing
```jsx
import { AdSlot } from "@/components/AdSlot";

<AdSlot 
  size="rectangle"
  position="test-variant-a"
  className={experimentVariant === 'A' ? 'variant-a' : 'variant-b'}
>
  {/* Different ad content based on variant */}
</AdSlot>
```

### Revenue Optimization
- Header bidding ready
- Multiple ad network support
- Real-time yield optimization

## 📋 Checklist for Go-Live

- [ ] Update `adConfig.ts` with your ad network details
- [ ] Replace placeholder ads with real ad codes
- [ ] Test responsive behavior on all devices
- [ ] Verify ad loading performance
- [ ] Check GDPR/privacy compliance
- [ ] Monitor Core Web Vitals impact
- [ ] Set up analytics tracking

## 🔧 Maintenance

### Regular Updates
- Monitor ad performance metrics
- Update ad sizes based on revenue data
- A/B test different placements
- Optimize for Core Web Vitals

### Troubleshooting
- Check browser console for ad loading errors
- Verify ad network configuration
- Test with ad blockers disabled
- Monitor layout shift metrics

---

Your blog is now **100% ad-ready** with:
✅ Responsive design  
✅ Performance optimized  
✅ SEO friendly  
✅ Multiple ad network support  
✅ Analytics ready  
✅ GDPR compliant  

Happy monetizing! 🎉
