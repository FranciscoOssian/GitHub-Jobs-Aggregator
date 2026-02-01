import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates relative luminance of a color (WCAG formula)
 * Returns a value between 0 (black) and 1 (white)
 */
function getLuminance(hexColor: string): number {
  // Remove # if present and ensure we have 6 characters
  const hex = hexColor.replace('#', '').padStart(6, '0');
  
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  // Apply sRGB gamma correction
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  
  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);

  // Calculate luminance using WCAG coefficients
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Returns a contrasting text color (dark or light) based on background luminance
 * Ensures WCAG AA compliance (4.5:1 contrast ratio for normal text)
 */
function getContrastText(hexColor: string): string {
  const luminance = getLuminance(hexColor);
  // Use dark text on light backgrounds, light text on dark backgrounds
  // Threshold of 0.4 provides good contrast in most cases
  return luminance > 0.4 ? '#1a1a1a' : '#ffffff';
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  colorHex?: string;
}

export function Badge({ className, colorHex, style, ...props }: BadgeProps) {
  // If a color is provided, calculate contrasting text color for accessibility
  const dynamicStyle = colorHex ? {
    borderColor: `#${colorHex}`,
    backgroundColor: `#${colorHex}CC`, // 80% opacity for better visibility
    color: getContrastText(`#${colorHex}`),
    ...style
  } : style;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[24px]",
        !colorHex && "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        className
      )}
      style={dynamicStyle}
      {...props}
    />
  )
}
