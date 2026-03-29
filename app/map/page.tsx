import { getArtworks } from "@/lib/data/artworks";
import type { Metadata } from "next";
import { ArtworksMap } from "@/components/map/artworks-map";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Map",
  description: "Overview map with all captured artworks.",
};

export default async function MapPage() {
  // Alle Artworks laden — limit 0 = kein Limit, da die Map alle Marker braucht
  const artworks = await getArtworks(1, 0);

  return (
    <section className="h-[calc(100dvh-var(--header-height))] w-full">
      <ArtworksMap artworks={artworks} className="h-full" />
    </section>
  );
}
