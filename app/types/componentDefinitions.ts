import { type LucideIcon } from "lucide-react";

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
