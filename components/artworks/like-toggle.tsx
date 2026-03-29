// components\artworks\like-toggle.tsx

"use client";

import { useEffect, useState } from "react";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  isLocallyLiked,
  addLocalLike,
  removeLocalLike,
} from "@/lib/likes/local-storage";

type LikeToggleProps = {
  artworkId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  isAuthenticated?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  countClassName?: string;
  showCount?: boolean;
  likedIconClassName?: string;
  unlikedIconClassName?: string;
  refreshOnSuccess?: boolean;
  onToggleSuccess?: (nextLiked: boolean) => void;
};

export function LikeToggle({
  artworkId,
  initialLiked,
  initialLikeCount,
  isAuthenticated = true,
  onClick,
  className = "",
  countClassName = "",
  showCount = true,
  likedIconClassName = "size-5 fill-current text-pink-500",
  unlikedIconClassName = "size-5 text-white",
  refreshOnSuccess = false,
  onToggleSuccess,
}: LikeToggleProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  // Lokale Likes aus localStorage laden (nur für nicht eingeloggte User)
  useEffect(() => {
    if (!isAuthenticated && isLocallyLiked(artworkId)) {
      setLiked(true);
      setLikeCount(initialLikeCount + 1);
    }
  }, [isAuthenticated, artworkId, initialLikeCount]);

  async function handleLikeClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);

    // Nicht eingeloggt → Like lokal im Browser speichern
    if (!isAuthenticated) {
      const nextLiked = !liked;
      setLiked(nextLiked);
      setLikeCount(initialLikeCount + (nextLiked ? 1 : 0));

      if (nextLiked) {
        addLocalLike(artworkId);
      } else {
        removeLocalLike(artworkId);
      }

      onToggleSuccess?.(nextLiked);
      return;
    }

    if (isPending) return;

    setIsPending(true);

    try {
      const response = await fetch(`/api/artworks/${artworkId}/like`, {
        method: liked ? "DELETE" : "POST",
      });

      const data = await response.json().catch(() => null);
      if (refreshOnSuccess) {
        router.refresh();
      }

      if (!response.ok) {
        throw new Error(data?.message ?? "Like request failed.");
      }

      setLiked(data.liked);
      setLikeCount(data.likeCount);
      onToggleSuccess?.(data.liked);
    } catch {
      toast.error("Could not update like. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLikeClick}
      disabled={isPending}
      aria-pressed={liked}
      aria-label={liked ? "Remove like" : "Like artwork"}
      className={className}
    >
      {liked ? (
        <IconHeartFilled className={likedIconClassName} />
      ) : (
        <IconHeart className={unlikedIconClassName} />
      )}

      {showCount ? <span className={countClassName}>{likeCount}</span> : null}
    </button>
  );
}
