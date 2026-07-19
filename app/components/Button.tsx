import clsx from "clsx";

import { ButtonProps } from "../types/componentDefinitions";

export default function Button({
  text,
  type,
  style,
  onClick,
  icon: Icon,
  iconSize = 18,
  iconClass,
}: ButtonProps) {
  const defaultStyle =
    "mt-6 w-full rounded-2xl bg-[#e9eef7] px-4 py-3 text-sm font-semibold text-slate-700 shadow-[8px_8px_16px_#c7d0de,-8px_-8px_16px_#ffffff] transition hover:shadow-[6px_6px_12px_#c7d0de,-6px_-6px_12px_#ffffff] focus:outline-none";
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(style || defaultStyle)}
    >
      {Icon && <Icon size={iconSize} className={iconClass} />}
      {text}
    </button>
  );
}
