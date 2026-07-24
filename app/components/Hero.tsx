import Image from "next/image";
import Button from "@/app/components/Button";
import { placeholderImage } from "@/app/lib/format";
import { HeroProps } from "../types/componentDefinitions";

export function Hero({
  eyebrow,
  title,
  description,
  ctaLabel,
  imageText,
  imageAlt,
}: HeroProps) {
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

        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:aspect-6/5">
          <div className="relative h-full w-full">
            <Image
              src={placeholderImage(imageText, 800, 800)}
              alt={imageAlt}
              fill
              sizes="(min-width: 768px) 480px, 100vw"
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
