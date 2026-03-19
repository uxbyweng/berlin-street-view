import exifr from "exifr";

export type ExtractedCoordinates = {
  latitude: number;
  longitude: number;
};

type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  originalFilename?: string;
};

export async function extractCoordinatesFromImage(
  file: File
): Promise<ExtractedCoordinates | null> {
  try {
    const gpsData = await exifr.gps(file);

    if (
      gpsData &&
      typeof gpsData.latitude === "number" &&
      typeof gpsData.longitude === "number"
    ) {
      return {
        latitude: Number(gpsData.latitude.toFixed(6)),
        longitude: Number(gpsData.longitude.toFixed(6)),
      };
    }

    return null;
  } catch (error) {
    console.error("Client EXIF GPS extraction failed:", error);
    return null;
  }
}

export async function uploadImageToCloudinary(
  file: File
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.");
  }

  if (!uploadPreset) {
    throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
  }

  const uploadFormData = new FormData();
  uploadFormData.append("file", file);
  uploadFormData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: uploadFormData,
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error?.message || "Cloudinary upload failed.");
  }

  if (!result?.secure_url) {
    throw new Error("Cloudinary upload returned no secure_url.");
  }

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
    originalFilename: result.original_filename,
  };
}
