"use client";

import { useUserLocation } from "@/lib/hooks/use-user-location";

/**
 * Inititalisierung für Standort-Logik.
 * Sorgt dafür, dass Standort-Abfrage direkt beim App-Start losläuft.
 */
export function UserLocationBootstrap() {
  // Lade Hook 'useUserLocation', der folgendes tut:
  // 1. Check, ob Standort schon im localStorage gespeichert ist.
  // 2. Wenn nicht, triggert er die GPS-Abfrage im Browser.
  // 3. Am Ende landet die Position im globalen State, damit die ganze App darauf zugreifen kann.
  useUserLocation();

  // Die Komponente selbst rendert absolut nichts (kein UI).
  // Sie dient nur als Container, damit der oben genannte Hook ausgeführt wird.
  return null;
}
