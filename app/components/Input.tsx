"use client";

import clsx from "clsx";

import { InputProps } from "../types/componentDefinitions";

export default function Input({
  placeholder,
  type,
  style,
  value,
  name,
  onChange,
}: InputProps) {
  const defaultStyle =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-sm transition-all duration-300 focus:border-orange-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-orange-500/5";
  return (
    <input
      placeholder={placeholder}
      className={clsx(style || defaultStyle)}
      type={type}
      value={value}
      name={name}
      onChange={(e) => onChange?.(e.target.value, name)}
    />
  );
}
