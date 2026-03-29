// Lokale Likes für nicht eingeloggte User.
// Gleiche Konvention wie lib/location/storage.ts

const LIKES_STORAGE_KEY = "streetlens:local-likes";

function getLocalLikes(): Set<string> {
  if (typeof window === "undefined") return new Set();

  const raw = window.localStorage.getItem(LIKES_STORAGE_KEY);
  if (!raw) return new Set();

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function saveLocalLikes(likes: Set<string>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify([...likes]));
}

export function isLocallyLiked(artworkId: string): boolean {
  return getLocalLikes().has(artworkId);
}

export function addLocalLike(artworkId: string): void {
  const likes = getLocalLikes();
  likes.add(artworkId);
  saveLocalLikes(likes);
}

export function removeLocalLike(artworkId: string): void {
  const likes = getLocalLikes();
  likes.delete(artworkId);
  saveLocalLikes(likes);
}
