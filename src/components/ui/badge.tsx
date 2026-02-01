import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  colorHex?: string;
}

export function Badge({ className, colorHex, style, ...props }: BadgeProps) {
  // If a color is provided, we use it for border/background with stronger opacity for better contrast
  const dynamicStyle = colorHex ? {
    borderColor: `#${colorHex}B0`, // Stronger border (70% opacity)
    backgroundColor: `#${colorHex}40`, // 40 = approx 25% opacity (was 20/12%)
    color: `#${colorHex}`,
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
