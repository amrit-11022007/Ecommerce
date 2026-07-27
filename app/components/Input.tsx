"use client";

import clsx from "clsx";
import { InputProps } from "../types/componentDefinitions";
import { Search } from "lucide-react";

export default function Input({
  placeholder,
  type = "text",
  style,
  value,
  name,
  onChange,
  required,
  disabled,
}: InputProps) {
  const defaultStyle =
    "w-full rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm px-5 py-3.5 text-sm text-[#2D3436] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 focus:bg-white focus:shadow-lg focus:shadow-[#6C63FF]/10 hover:border-gray-300 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:shadow-none";

  const searchStyle =
    "w-full rounded-2xl border-2 border-gray-100 bg-white px-5 py-4 pl-14 text-sm text-[#2D3436] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 focus:shadow-xl focus:shadow-[#6C63FF]/10 hover:border-gray-200 hover:shadow-md";

  const appliedStyle =
    style || (type === "search" ? searchStyle : defaultStyle);

  return (
    <div className="relative w-full">
      {type === "search" && (
        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 peer-focus:text-[#6C63FF]"
        />
      )}
      <input
        placeholder={placeholder}
        className={clsx(appliedStyle, "peer")}
        type={type}
        value={value}
        name={name}
        onChange={(e) => onChange?.(e.target.value, name)}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}
