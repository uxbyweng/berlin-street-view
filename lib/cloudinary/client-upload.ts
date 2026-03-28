import exifr from "exifr"; // importier Bibliothek zum Auslesen von EXIF-Daten

// --- TYP-DEFINITIONEN ---
export type ExtractedCoordinates = {
  latitude: number; // Breitengrad (Zahl)
  longitude: number; // Längengrad (Zahl)
};

type CloudinaryUploadResult = {
  secureUrl: string; // URL des hochgeladenen Bildes
  publicId: string; // eindeutige ID von Cloudinary für das Bild
  originalFilename?: string; // Optional: Der ursprüngliche Name der Datei
};

// --- FUNKTION: KOORDINATEN AUSLESEN ---
/**
 * Versucht, GPS-Daten aus einer Bilddatei zu extrahieren.
 */
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

type ExifDebugPayload = {
  step: string;
  data?: unknown;
};

export async function extractCoordinatesFromImage(
  file: File,
  onDebug?: (payload: ExifDebugPayload) => void
): Promise<ExtractedCoordinates | null> {
  try {
    onDebug?.({
      step: "file-meta",
      data: {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      },
    });

    let latitude: number | undefined;
    let longitude: number | undefined;

    // Versuch 1: direkt auf dem File
    try {
      const gpsFromFile = await exifr.gps(file);
      onDebug?.({ step: "gps(file)", data: gpsFromFile });

      latitude = Number(gpsFromFile?.latitude);
      longitude = Number(gpsFromFile?.longitude);
    } catch (error) {
      onDebug?.({
        step: "gps(file)-error",
        data: error instanceof Error ? error.message : String(error),
      });
    }

    // Versuch 2: parse(file, { gps: true })
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      try {
        const parsedGps = await exifr.parse(file, { gps: true });
        onDebug?.({ step: "parse(file,{gps:true})", data: parsedGps });

        latitude = Number(parsedGps?.latitude);
        longitude = Number(parsedGps?.longitude);
      } catch (error) {
        onDebug?.({
          step: "parse(file,{gps:true})-error",
          data: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Versuch 3: ArrayBuffer als Fallback
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      try {
        const buffer = await file.arrayBuffer();
        onDebug?.({
          step: "arrayBuffer-created",
          data: { byteLength: buffer.byteLength },
        });

        const gpsFromBuffer = await exifr.gps(buffer);
        onDebug?.({ step: "gps(buffer)", data: gpsFromBuffer });

        latitude = Number(gpsFromBuffer?.latitude);
        longitude = Number(gpsFromBuffer?.longitude);
      } catch (error) {
        onDebug?.({
          step: "gps(buffer)-error",
          data: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Versuch 4: parse(file, true) als harter letzter Fallback
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      try {
        const parsedAll = await exifr.parse(file, true);
        onDebug?.({ step: "parse(file,true)", data: parsedAll });

        latitude = Number(parsedAll?.latitude);
        longitude = Number(parsedAll?.longitude);
      } catch (error) {
        onDebug?.({
          step: "parse(file,true)-error",
          data: error instanceof Error ? error.message : String(error),
        });
      }
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      onDebug?.({
        step: "final-result",
        data: { latitude: null, longitude: null },
      });
      return null;
    }

    const result = {
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
    };

    onDebug?.({
      step: "final-result",
      data: result,
    });

    return result;
  } catch (error) {
    onDebug?.({
      step: "fatal-error",
      data: error instanceof Error ? error.message : String(error),
    });
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
