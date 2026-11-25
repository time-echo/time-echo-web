"use client";

import { useTimeEcho } from "@/lib/context/TimeEchoContext";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
}

export interface SocialProofData {
  lettersSent: number | null;
  testimonials: Testimonial[];
}

export const SOCIAL_PROOF: SocialProofData = {
  lettersSent: null,
  testimonials: [],
};

interface SocialProofProps {
  data?: SocialProofData;
}

export function SocialProof({ data = SOCIAL_PROOF }: SocialProofProps) {
  const { locale, t } = useTimeEcho();

  const hasCount = typeof data.lettersSent === "number" && data.lettersSent > 0;
  const hasTestimonials = data.testimonials.length > 0;

  if (!hasCount && !hasTestimonials) return null;

  return (
    <section className="max-w-3xl mx-auto space-y-6 text-center">
      {hasCount && (
        <p className="font-serif-editorial text-2xl sm:text-3xl text-foreground">
          {t("landing.socialProofLetters", {
            count: new Intl.NumberFormat(locale).format(data.lettersSent ?? 0),
          })}
        </p>
      )}
      {hasTestimonials && (
        <div className="space-y-5">
          {data.testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="border-l-2 border-wax pl-4 text-left"
            >
              <blockquote className="font-letter text-sm leading-relaxed text-foreground">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-1 font-letter text-xs text-foreground-muted">
                {testimonial.author}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
