import { Badge } from '@/components/ui/badge';

interface PricingDisplayProps {
  isFree?: boolean;
  pricing?: number;
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PricingDisplay({ 
  isFree, 
  pricing, 
  variant = 'secondary',
  size = 'sm',
  className = '' 
}: PricingDisplayProps) {
  // Don't render anything if neither field is provided
  if (isFree === undefined && pricing === undefined) {
    return null;
  }

  const getPricingText = () => {
    // If isFree === true and pricing === 0: show "Free"
    if (isFree === true && (pricing === undefined || pricing === 0)) {
      return 'Free';
    }
    
    // If isFree === true and pricing > 0: show "Free + $<pricing>/mo"
    if (isFree === true && pricing !== undefined && pricing > 0) {
      return `Free + $${pricing.toFixed(2)}/mo`;
    }
    
    // If isFree === false and pricing > 0: show "$<pricing>/mo"
    if (isFree === false && pricing !== undefined && pricing > 0) {
      return `$${pricing.toFixed(2)}/mo`;
    }
    
    // If only pricing is provided without isFree
    if (isFree === undefined && pricing !== undefined && pricing > 0) {
      return `$${pricing.toFixed(2)}/mo`;
    }
    
    // If only isFree is provided without pricing
    if (pricing === undefined && isFree === true) {
      return 'Free';
    }
    
    // Fallback
    return 'N/A';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'md':
        return 'text-sm px-2.5 py-1';
      case 'lg':
        return 'text-base px-3 py-1.5';
      default:
        return 'text-xs px-2 py-0.5';
    }
  };

  const pricingText = getPricingText();

  return (
    <Badge 
      variant={variant} 
      className={`${getSizeClasses()} font-medium ${className}`}
    >
      {pricingText}
    </Badge>
  );
}
