import { AppShell } from "@/components/layout/app-shell";
import { ArtworkCard } from "@/components/artworks/artwork-card";
import { mockArtworks } from "@/lib/mock-artworks";

export default function Artworks() {
  return (
    <AppShell>
      <section className="mx-auto rounded-2xl border p-6">
        <h1 className="text-2xl font-semibold">Artwork List</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Overview of all available artworks to quickly discover interesting
          artworks.
        </p>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockArtworks.map((artwork) => (
          <ArtworkCard key={artwork._id} artwork={artwork} />
        ))}
      </section>
    </AppShell>
  );
}
