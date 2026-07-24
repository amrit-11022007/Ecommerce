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
    "w-full rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-400 backdrop-blur-sm transition-all duration-300 hover:bg-orange-500/20 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10 active:scale-[0.98] focus:outline-none";
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
