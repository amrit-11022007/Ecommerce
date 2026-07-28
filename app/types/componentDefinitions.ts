import { ReactNode, MouseEvent } from "react";
import { DisplayProduct } from "./definitions";

export interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "default" | "lg" | "xl";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  iconSize?: number;
  iconClass?: string;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export interface InputProps {
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  style?: string;
  value?: string | number;
  name?: string;
  onChange?: (value: string, name?: string) => void;
  required?: boolean;
  disabled?: boolean;
}

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
  isAuthenticated?: boolean;
};

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
};
