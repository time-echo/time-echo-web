"use client";

import React, { useState, useEffect } from "react";
import { Stamp } from "./Stamp";
import { useStampCatalog } from "./useStampCatalog";
import { LetterStampInfo, StampDetailResponse } from "@/types/timeecho";
import { StampSize } from "./StampPerforationFrame";

export interface LetterStampProps {
  stamp?: LetterStampInfo | null;
  stampId?: string | null;
  size?: StampSize;
  rotation?: number;
  hasPostmark?: boolean;
  interactive?: boolean;
  animateAffix?: boolean;
  hasPaperTexture?: boolean;
  paperColor?: string;
  borderColor?: string;
  className?: string;
  postmarkVariant?: "waves" | "circular" | "combo";
  postmarkDate?: string;
}

/**
 * Renders the stamp assigned to a letter following System Design v2.0 Figure 6:
 * - Empty Fallback: If letter has no stamp (stamp/stampId is null), renders nothing.
 * - Active Catalog: If stamp is in active catalog, renders immediately with dynamic SVG.
 * - Historical Preservation: If not in active catalog (inactive/historical), fetches
 *   detail via GET /api/v1/stamps/:slug and renders the safe SVG.
 */
export function LetterStamp({
  stamp,
  stampId,
  size = "md",
  rotation = 0,
  hasPostmark = false,
  interactive = false,
  animateAffix = false,
  hasPaperTexture = true,
  paperColor,
  borderColor,
  className,
  postmarkVariant = "combo",
  postmarkDate,
}: LetterStampProps) {
  const slug = stamp?.slug || stampId;
  const { stamps, getStampBySlug } = useStampCatalog();
  const [detail, setDetail] = useState<StampDetailResponse | null>(null);

  const catalogMatch = stamps.find((s) => s.slug === slug);
  const activeSvg = catalogMatch?.svg_content || catalogMatch?.svgContent;

  useEffect(() => {
    let ignore = false;
    if (slug && !activeSvg) {
      getStampBySlug(slug).then((res) => {
        if (!ignore && res) {
          setDetail(res);
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [slug, activeSvg, getStampBySlug]);

  // Figure 6: If no stamp was assigned, render empty fallback (nothing)
  if (!slug) {
    return null;
  }

  const svgContent = activeSvg || detail?.svg_content || detail?.svgContent;
  const name = stamp?.name || catalogMatch?.name || detail?.name;
  const categorySlug =
    stamp?.category_slug ||
    stamp?.categorySlug ||
    catalogMatch?.category_slug ||
    catalogMatch?.categorySlug ||
    detail?.category_slug ||
    detail?.categorySlug;

  return (
    <Stamp
      slug={slug}
      svgContent={svgContent}
      name={name}
      categorySlug={categorySlug}
      size={size}
      rotation={rotation}
      hasPostmark={hasPostmark}
      interactive={interactive}
      animateAffix={animateAffix}
      hasPaperTexture={hasPaperTexture}
      paperColor={paperColor}
      borderColor={borderColor}
      className={className}
      postmarkVariant={postmarkVariant}
      postmarkDate={postmarkDate}
    />
  );
}
