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
      <div className="neu-raised grid gap-10 p-8 md:grid-cols-2 md:p-14">
        <div className="flex flex-col justify-center gap-6">
          <span className="neu-inset w-fit px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-(--neu-accent)">
            {eyebrow}
          </span>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            {title}
          </h1>

          <p className="max-w-md text-(--neu-text-muted)">{description}</p>

          <Button
            type="button"
            style="w-fit px-7 py-3.5 text-sm font-semibold text-[var(--neu-accent)]"
            text={`${ctaLabel}→`}
          />
        </div>

        <div className="neu-raised relative aspect-square overflow-hidden p-4 md:aspect-6/5">
          <div className="relative h-full w-full">
            <Image
              src={placeholderImage(imageText, 800, 800)}
              alt={imageAlt}
              fill
              sizes="(min-width: 768px) 480px, 100vw"
              className="rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
