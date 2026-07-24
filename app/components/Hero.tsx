import Button from "@/app/components/Button";
import { HeroProps } from "../types/componentDefinitions";
import NeoStoreLogo from "./Logo";

export function Hero({ eyebrow, title, description, ctaLabel }: HeroProps) {
  return (
    <section className="mx-auto mt-12 max-w-6xl">
      <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:grid-cols-2 md:p-14">
        <div className="flex flex-col justify-center gap-6">
          <span className="w-fit rounded-lg border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-orange-400 backdrop-blur-sm">
            {eyebrow}
          </span>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            {title}
          </h1>

          <p className="max-w-md text-slate-400">{description}</p>

          <Button
            type="button"
            style="w-fit px-7 py-3.5 text-sm font-semibold text-orange-400"
            text={`${ctaLabel} →`}
          />
        </div>

        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-orange-500/20 via-white/10 to-slate-700/30 p-4 backdrop-blur-sm md:aspect-6/5">
          <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-center">
            <span className="text-3xl font-semibold tracking-[0.25em] text-white/80">
              <NeoStoreLogo size="xl" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
