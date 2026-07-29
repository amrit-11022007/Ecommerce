import Button from "@/app/components/Button";
import NeoStoreLogo from "./Logo";

import { HeroProps } from "../types/componentDefinitions";

export function Hero({ eyebrow, title, description, ctaLabel }: HeroProps) {
  return (
    <section className="container-premium pt-8 pb-4">
      <div className="relative overflow-hidden rounded-[3rem] bg-linear-to-br from-[#F0F8FF] via-white to-[#F8F0FF] border border-gray-100 p-8 md:p-16 shadow-2xl shadow-[#6C63FF]/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-[#6C63FF]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-linear-to-tr from-[#2874F0]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-linear-to-r from-[#FF9F43]/5 to-transparent rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative grid gap-12 md:grid-cols-2 md:gap-20 items-center">
          <div className="flex flex-col justify-center gap-7">
            <span className="w-fit rounded-full bg-linear-to-r from-[#2874F0]/10 to-[#6C63FF]/10 backdrop-blur-sm border border-[#6C63FF]/20 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#6C63FF]">
              {eyebrow}
            </span>

            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-[#2D3436] md:text-6xl lg:text-7xl">
              <span className="bg-linear-to-r from-[#2874F0] to-[#6C63FF] bg-clip-text text-transparent">
                {title}
              </span>
            </h1>

            <p className="max-w-lg text-lg text-gray-500 font-medium leading-relaxed">
              {description}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Button
                type="button"
                variant="primary"
                text={`${ctaLabel} →`}
                size="lg"
                className="shadow-xl shadow-[#6C63FF]/30 hover:shadow-2xl hover:shadow-[#6C63FF]/40"
              />
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#FF9F43] to-[#FF6B6B] border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#2874F0] to-[#6C63FF] border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#6C63FF] to-[#FF9F43] border-2 border-white" />
                </div>
                <span className="text-sm font-semibold text-gray-500">
                  10k+ happy customers
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-lg rounded-[2.5rem] bg-linear-to-br from-white to-[#F0F8FF] border border-gray-100 shadow-2xl flex items-center justify-center overflow-hidden p-12 group">
              <div className="absolute inset-0 bg-linear-to-tr from-[#6C63FF]/5 via-transparent to-[#2874F0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                <NeoStoreLogo size="xl" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-linear-to-br from-[#FF9F43] to-[#FF6B6B] rounded-3xl rotate-12 opacity-80 blur-sm" />
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-linear-to-br from-[#2874F0] to-[#6C63FF] rounded-3xl -rotate-12 opacity-80 blur-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
