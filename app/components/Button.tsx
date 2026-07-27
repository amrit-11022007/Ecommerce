import clsx from "clsx";
import { ButtonProps } from "../types/componentDefinitions";

export default function Button({
  text,
  type = "button",
  variant = "primary",
  size = "default",
  onClick,
  icon: Icon,
  iconSize = 18,
  iconClass,
  className,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = clsx(
    "relative inline-flex items-center justify-center gap-2",
    "font-semibold tracking-wide transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
    "select-none overflow-hidden",
    {
      "w-full": fullWidth,
    },
  );

  const variantStyles = {
    primary: clsx(
      "bg-gradient-to-r from-[#2874F0] to-[#6C63FF] text-white",
      "hover:from-[#1a5dc7] hover:to-[#5a52e0] hover:shadow-lg hover:shadow-[#6C63FF]/25",
      "focus:ring-[#6C63FF]/40",
      "active:scale-[0.97]",
    ),
    secondary: clsx(
      "bg-white text-[#2D3436]",
      "border border-[#E2E8F0]",
      "hover:bg-[#F8F9FA] hover:border-[#2874F0]/30 hover:shadow-md hover:shadow-[#2874F0]/10",
      "focus:ring-[#2874F0]/30",
      "active:scale-[0.97]",
    ),
    ghost: clsx(
      "bg-transparent text-[#2D3436]",
      "hover:bg-[#F0F8FF] hover:text-[#2874F0]",
      "focus:ring-[#2874F0]/20",
    ),
    outline: clsx(
      "bg-transparent text-[#2874F0]",
      "border-2 border-[#2874F0]",
      "hover:bg-gradient-to-r hover:from-[#2874F0] hover:to-[#6C63FF] hover:text-white hover:border-transparent hover:shadow-lg",
      "focus:ring-[#6C63FF]/30",
      "active:scale-[0.97]",
    ),
    danger: clsx(
      "bg-gradient-to-r from-red-500 to-red-600 text-white",
      "hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25",
      "focus:ring-red-500/40",
      "active:scale-[0.97]",
    ),
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-full",
    default: "px-6 py-3 text-sm rounded-full",
    lg: "px-8 py-4 text-base rounded-full",
    xl: "px-10 py-5 text-lg rounded-full",
  };

  const iconStyles = clsx(
    "flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
    {
      "order-first": Icon && !iconClass?.includes("order-"),
    },
    iconClass,
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "group",
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {Icon && <Icon size={iconSize} className={iconStyles} />}
      <span className="relative z-10">{text}</span>
      {variant === "primary" && !disabled && (
        <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
      )}
    </button>
  );
}
