"use client";

import { LikeToggle } from "@/components/artworks/like-toggle";

type LikeButtonProps = {
  artworkId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  isAuthenticated: boolean;
};

export function LikeButton({
  artworkId,
  initialLiked,
  initialLikeCount,
  isAuthenticated,
}: LikeButtonProps) {
  return (
    <LikeToggle
      artworkId={artworkId}
      initialLiked={initialLiked}
      initialLikeCount={initialLikeCount}
      isAuthenticated={isAuthenticated}
      className="flex items-center gap-2 px-1 py-1"
      likedIconClassName="size-6 text-pink-500"
      unlikedIconClassName="size-6 text-foreground"
      countClassName="text-base font-medium text-foreground"
    />
  );
}
