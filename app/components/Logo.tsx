import React from "react";

// 1. Define explicit types for variants and sizes
type LogoVariant = "standard" | "uppercase" | "lowercase";
type LogoSize = "sm" | "md" | "lg" | "xl";

interface NeoStoreLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  glow?: boolean;
  className?: string;
}

export default function NeoStoreLogo({
  variant = "standard",
  size = "md",
  glow = false,
  className = "",
}: NeoStoreLogoProps) {
  // 2. Explicitly type the object structure so TypeScript knows the exact keys
  const textMap: Record<LogoVariant, { prefix: string; suffix: string }> = {
    standard: { prefix: "Neo-", suffix: "Store" },
    uppercase: { prefix: "NEO-", suffix: "STORE" },
    lowercase: { prefix: "neo-", suffix: "store" },
  };

  const sizeClasses: Record<LogoSize, string> = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl",
  };

  // Safe indexing with fallbacks
  const { prefix, suffix } = textMap[variant] ?? textMap.standard;

  return (
    <div
      className={`inline-flex items-center font-extrabold tracking-tight select-none ${sizeClasses[size]} ${className}`}
    >
      <span
        className={`relative transition-all duration-300 ${
          glow ? "drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]" : ""
        }`}
      >
        {/* Neon Green Accent */}
        <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-500">
          {prefix}
        </span>

        {/* Neon Orange Accent */}
        <span
          className={`text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-500 ${
            glow ? "drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]" : ""
          }`}
        >
          {suffix}
        </span>
      </span>
    </div>
  );
}
