import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Artwork } from "@/types/artwork";

type ArtworkCardProps = {
  artwork: Artwork;
  href?: string;
  variant?: "preview" | "detail";
};

export function ArtworkCard({
  artwork,
  href,
  variant = "detail",
}: ArtworkCardProps) {
  const isDetail = variant === "preview";

  const cardContent = (
    <>
      <div className="relative">
        <Image
          src={artwork.imageUrl ?? "/images/artwork-placeholder.jpg"}
          alt={`${artwork.title}${artwork.author ? ` - ${artwork.author}` : ""}`}
          width={800}
          height={450}
          className="aspect-video w-full object-cover"
        />

        {!isDetail ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <CardTitle className="line-clamp-2 text-lg text-white">
                {artwork.title}
              </CardTitle>

              {artwork.author ? (
                <CardDescription className="text-white/80">
                  {artwork.author}
                </CardDescription>
              ) : null}

              {artwork.latitude != null && artwork.longitude != null ? (
                <p className="text-xs text-white/80">
                  📍 {artwork.latitude.toFixed(4)},{" "}
                  {artwork.longitude.toFixed(4)}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </div>

      {isDetail ? (
        <CardHeader>
          <CardTitle>{artwork.title}</CardTitle>

          {artwork.author ? (
            <CardDescription>{artwork.author}</CardDescription>
          ) : null}

          {artwork.description ? (
            <p className="py-2 text-sm text-foreground">
              {artwork.description}
            </p>
          ) : null}

          {artwork.latitude != null && artwork.longitude != null ? (
            <p className="text-xs text-muted-foreground">
              Location:{" "}
              <a
                className="text-blue-700 underline underline-offset-2"
                href={`https://www.google.com/maps?q=${artwork.latitude},${artwork.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {artwork.latitude.toFixed(4)}, {artwork.longitude.toFixed(4)}
              </a>
            </p>
          ) : null}

          {artwork.tags?.length ? (
            <p className="text-xs text-muted-foreground">
              Keywords: {artwork.tags.join(", ")}
            </p>
          ) : null}

          <p className="text-xs text-muted-foreground">
            User:{" "}
            <Link
              href="/users/maxi1973"
              className="text-primary underline underline-offset-2"
            >
              @maxi1973
            </Link>
          </p>
        </CardHeader>
      ) : null}
    </>
  );

  //  Verlinkung der Card nur im 'preview' mode
  if (!isDetail && href) {
    return (
      <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden py-0 transition hover:shadow-md">
        <Link
          href={href}
          className="flex h-full flex-col focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {cardContent}
        </Link>
      </Card>
    );
  }

  return (
    <Card className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden pt-0">
      {cardContent}
    </Card>
  );
}
