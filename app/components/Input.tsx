import { InputProps } from "../types/componentDefinitions";

export default function Input({
  placeholder,
  type,
  style,
  value,
  name,
  onChange,
}: InputProps) {
  return (
    <input
      placeholder={placeholder}
      className={`w-full rounded-2xl border-0 bg-[#e9eef7] px-4 py-3 text-sm text-slate-700 outline-none shadow-[inset_8px_8px_16px_#c9d2e0,inset_-8px_-8px_16px_#ffffff] placeholder:text-slate-400 ${style}`}
      type={type}
      value={value}
      name={name}
      onChange={(e) => onChange?.(e.target.value, name)}
    />
  );
}
