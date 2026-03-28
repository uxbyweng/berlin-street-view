// UPLOAD STEUERUNG

import exifr from "exifr"; // importier Bibliothek zum Auslesen von EXIF-Daten

// --- TYP-DEFINITIONEN ---
export type ExtractedCoordinates = {
  latitude: number;
  longitude: number;
};

export type ExifDebugInfo = {
  fileInfo: {
    name: string;
    type: string;
    size: number;
  };
  gpsDataRaw: unknown;
  fullExifRaw: unknown;
  gpsSearchResults: {
    allKeys: string[];
    gpsRelatedKeys: string[];
  };
  latitude: number | null;
  longitude: number | null;
  error?: string;
};

type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  originalFilename?: string;
};

// --- FUNKTION: KOORDINATEN AUSLESEN MIT DEBUG-INFO ---
/**
 * Versucht, GPS-Daten aus einer Bilddatei zu extrahieren und gibt Debug-Info zurück.
 */
export async function extractCoordinatesWithDebug(
  file: File
): Promise<{ coordinates: ExtractedCoordinates | null; debug: ExifDebugInfo }> {
  const fileInfo = {
    name: file.name,
    type: file.type,
    size: file.size,
  };

  try {
    let gpsDataRaw: unknown = null;
    let fullExifRaw: unknown = null;
    let latitude: number | null = null;
    let longitude: number | null = null;

    // exifr.gps(file) sucht nach Breiten- und Längengraden in den Bilddaten
    gpsDataRaw = await exifr.gps(file);
    latitude = Number(
      (gpsDataRaw as Record<string, unknown> | null)?.latitude ?? null
    );
    longitude = Number(
      (gpsDataRaw as Record<string, unknown> | null)?.longitude ?? null
    );

    // Fallback: Wenn exifr.gps() null zurückgibt, versuche exifr.parse()
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      fullExifRaw = await exifr.parse(file);
      const exifObj = fullExifRaw as Record<string, unknown>;

      // Versuche verschiedene mögliche GPS-Strukturen:
      // 1. exifObj.latitude / exifObj.longitude (direktE Werte)
      // 2. exifObj.gps.latitude / exifObj.gps.longitude (nested)
      // 3. exifObj.GPSLatitude / exifObj.GPSLongitude (uppercase)
      // 4. Arrays wie [degrees, minutes, seconds]

      let rawLat =
        exifObj?.latitude ??
        (exifObj?.gps as Record<string, unknown> | undefined)?.latitude ??
        exifObj?.GPSLatitude;
      let rawLng =
        exifObj?.longitude ??
        (exifObj?.gps as Record<string, unknown> | undefined)?.longitude ??
        exifObj?.GPSLongitude;

      // Wenn GPS-Daten als Arrays kommen [degrees, minutes, seconds],
      // konvertiere sie in dezimale Grade
      if (Array.isArray(rawLat) && rawLat.length >= 2) {
        const [degrees, minutes, seconds = 0] = rawLat as number[];
        if (Number.isFinite(degrees)) {
          latitude = Number(
            (Math.abs(degrees) + minutes / 60 + (seconds ?? 0) / 3600).toFixed(
              6
            )
          );
          if (degrees < 0) latitude = -latitude;
        }
      } else {
        latitude = Number(rawLat ?? null);
      }

      if (Array.isArray(rawLng) && rawLng.length >= 2) {
        const [degrees, minutes, seconds = 0] = rawLng as number[];
        if (Number.isFinite(degrees)) {
          longitude = Number(
            (Math.abs(degrees) + minutes / 60 + (seconds ?? 0) / 3600).toFixed(
              6
            )
          );
          if (degrees < 0) longitude = -longitude;
        }
      } else {
        longitude = Number(rawLng ?? null);
      }
    }

    const hasValidCoordinates =
      Number.isFinite(latitude) && Number.isFinite(longitude);

    const coordinates = hasValidCoordinates
      ? {
          latitude: Number(latitude!.toFixed(6)),
          longitude: Number(longitude!.toFixed(6)),
        }
      : null;

    // GPS-Suche in der vollständigen EXIF-Struktur
    const allKeys = Object.keys((fullExifRaw as Record<string, unknown>) || {});
    const gpsRelatedKeys = allKeys.filter((key) =>
      key.toLowerCase().includes("gps")
    );

    return {
      coordinates,
      debug: {
        fileInfo,
        gpsDataRaw,
        fullExifRaw,
        gpsSearchResults: {
          allKeys,
          gpsRelatedKeys,
        },
        latitude: hasValidCoordinates ? latitude : null,
        longitude: hasValidCoordinates ? longitude : null,
      },
    };
  } catch (error) {
    return {
      coordinates: null,
      debug: {
        fileInfo,
        gpsDataRaw: null,
        fullExifRaw: null,
        gpsSearchResults: {
          allKeys: [],
          gpsRelatedKeys: [],
        },
        latitude: null,
        longitude: null,
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

// --- FUNKTION: KOORDINATEN AUSLESEN ---
/**
 * Versucht, GPS-Daten aus einer Bilddatei zu extrahieren.
 */
export async function extractCoordinatesFromImage(
  file: File
): Promise<ExtractedCoordinates | null> {
  const { coordinates } = await extractCoordinatesWithDebug(file);
  return coordinates;
}

// --- FUNKTION: BILD HOCHLADEN ---
/**
Client-Utility, die das Bild direkt vom Browser zu Cloudinary sendet
Diese Funktion macht:
- FormData erzeugen
- file anhängen
- upload_preset anhängen
- fetch("https://api.cloudinary.com/v1_1/<cloud>/image/upload")
 */
export async function uploadImageToCloudinary(
  file: File
): Promise<CloudinaryUploadResult> {
  // Zugangsdaten aus den Umgebungsvariablen (.env Datei) holen
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Sicherheitscheck: Sind die Zugangsdaten überhaupt konfiguriert?
  if (!cloudName) {
    throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.");
  }

  if (!uploadPreset) {
    throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
  }

  // "digitales Formular" erstellen, um Datei zu versenden
  const uploadFormData = new FormData();
  uploadFormData.append("file", file); // Das eigentliche Bild
  uploadFormData.append("upload_preset", uploadPreset); // Die Hochlade-Einstellung

  // Formular per POST-Anfrage an Cloudinary-Schnittstelle (API) senden
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: uploadFormData,
    }
  );

  // Server-Antwort in JavaScript-Objekt umwandeln
  const result = await response.json().catch(() => null);

  // Prüfen, ob der Server einen Fehler gemeldet hat (z.B. Code 400 oder 500)
  if (!response.ok) {
    throw new Error(result?.error?.message || "Cloudinary upload failed.");
  }

  // Prüfen, ob wirklich eine Bild-URL zurückgeliefert wurde
  if (!result?.secure_url) {
    throw new Error("Cloudinary upload returned no secure_url.");
  }

  // Alles erfolgreich! Return der wichtigsten Infos
  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
    originalFilename: result.original_filename,
  };
}
