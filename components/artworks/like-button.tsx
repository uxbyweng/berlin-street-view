"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isPending, setIsPending] = useState(false);

  async function handleLikeClick() {
    if (!isAuthenticated) {
      toast.error("Please log in to like artworks.");
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch(`/api/artworks/${artworkId}/like`, {
        method: liked ? "DELETE" : "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Like request failed.");
      }

      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch {
      toast.error("Could not update like. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={liked ? "default" : "outline"}
          onClick={handleLikeClick}
          disabled={isPending || !isAuthenticated}
          aria-pressed={liked}
          aria-label={liked ? "Remove like" : "Like artwork"}
        >
          <Heart className={liked ? "fill-current" : ""} />
          {liked ? "Liked" : "Like"}
        </Button>

        <span className="text-sm text-muted-foreground">
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
      </div>

      {!isAuthenticated ? (
        <p className="text-sm text-muted-foreground">
          Log in to like this artwork.
        </p>
      ) : null}
    </div>
  );
}
