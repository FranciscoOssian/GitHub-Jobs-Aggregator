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
  // If a color is provided, we use it for border/background with opacity
  const dynamicStyle = colorHex ? {
    borderColor: `#${colorHex}`,
    backgroundColor: `#${colorHex}20`, // 20 = approx 12% opacity
    color: `#${colorHex}`,
    ...style
  } : style;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        !colorHex && "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        className
      )}
      style={dynamicStyle}
      {...props}
    />
  )
}
