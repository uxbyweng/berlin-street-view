import { getArtworks } from "@/lib/data/artworks";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { ArtworksMap } from "@/components/map/artworks-map";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Map",
  description: "Overview map with all captured artworks.",
};

export default async function MapPage() {
  // Alle Artworks laden — limit 0 = kein Limit, da die Map alle Marker braucht
  const [artworks, session] = await Promise.all([getArtworks(1, 0), auth()]);

  return (
    <section className="h-[calc(100dvh-var(--header-height))] w-full">
      <ArtworksMap
        artworks={artworks}
        isAuthenticated={Boolean(session?.user)}
        className="h-full"
      />
    </section>
  );
}
