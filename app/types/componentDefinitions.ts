import { type LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { DisplayProduct } from "./definitions";

export type ButtonProps = {
  text?: string;
  type: "button" | "submit" | "reset";
  style?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  iconSize?: number;
  iconClass?: string;
};

export type InputProps = {
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  style?: string;
  value?: string;
  name?: string;
  onChange?: (value: string, field?: string) => void;
  autofocus?: boolean;
};

export type HeroProps = {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  searchPlaceholder?: string;
  ctaLabel: string;
  imageText: string;
  imageAlt: string;
};

export type ProductGridProps = {
  eyebrow: string;
  heading: string;
  products: DisplayProduct[];
};
