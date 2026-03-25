import { auth } from "@/auth";
import { ArtworkList } from "@/components/artworks/artwork-list";
import { getLatestArtworks } from "@/lib/data/artworks";
import { HeroSlider } from "@/components/home/hero-slider";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  const latestArtworks = await getLatestArtworks(3, session?.user?.id);

  return (
    <>
      <div className="relative w-full h-[calc(100vh-5rem)] md:h-[calc(100vh-5rem)] overflow-hidden">
        <HeroSlider />
      </div>

      <section className="mx-auto max-w-6xl my-8 px-4">
        <h2 className="text-lg font-semibold mb-4">Recently added ...</h2>
        <ArtworkList artworks={latestArtworks} />
      </section>
    </>
  );
}
