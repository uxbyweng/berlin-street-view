/**
 * Cloudinary-URL mit On-the-fly-Transformationen versehen.
 * Nur Cloudinary-URLs werden transformiert, alle anderen bleiben unverändert.
 */
export function getCloudinaryImageUrl(
  url: string | undefined,
  transform: string,
  fallback = ""
): string {
  if (!url) return fallback;

  if (!url.includes("res.cloudinary.com")) return url;

  return url.replace("/upload/", `/upload/${transform}/`);
}
