"use client";

import { ArtworksMap } from "@/components/map/artworks-map";
import type { Artwork } from "@/types/artwork";

type ArtworksMapClientProps = {
  artworks: Artwork[];
  className?: string;
};

export function ArtworksMapClient({
  artworks,
  className,
}: ArtworksMapClientProps) {
  return <ArtworksMap artworks={artworks} className={className} />;
}
