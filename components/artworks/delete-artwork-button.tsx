"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type DeleteArtworkButtonProps = {
  artworkId: string;
  artworkTitle: string;
};

export function DeleteArtworkButton({
  artworkId,
  artworkTitle,
}: DeleteArtworkButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Do you really want to delete "${artworkTitle}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/artworks/${artworkId}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to delete artwork.");
      }

      toast.success("Artwork successfully deleted.", {
        className: "!bg-green-200 !text-green-700 !border-green-500 mt-15",
      });

      router.push("/artworks");
      router.refresh();
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Artwork could not be deleted.";

      toast.error(message, {
        className: "!bg-red-200 !text-red-700 !border-red-500",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
