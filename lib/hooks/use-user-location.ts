"use client";

import { useEffect, useRef, useState } from "react";
import {
  getStoredUserLocation,
  setStoredUserLocation,
} from "@/lib/location/storage";
import { toast } from "sonner";

type Coordinates = {
  lat: number;
  lng: number;
};

type UseUserLocationReturn = {
  location: Coordinates | null;
  isRequesting: boolean;
  error: string | null;
};

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<Coordinates | null>(() => {
    const stored = getStoredUserLocation();
    return stored ? { lat: stored.lat, lng: stored.lng } : null;
  });
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (location) return;
    if (hasRequestedRef.current) return;

    hasRequestedRef.current = true;

    if (!navigator.geolocation) {
      toast.message("Geolocation is not supported on this device.");
      return;
    }

    const requestId = window.setTimeout(() => {
      setIsRequesting(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setLocation(coords);
          setStoredUserLocation(coords);
          setError(null);
          setIsRequesting(false);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setError("Location permission denied.");
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setError("Location unavailable.");
          } else if (err.code === err.TIMEOUT) {
            setError("Location request timed out.");
          } else {
            setError("Could not retrieve location.");
          }

          setIsRequesting(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 5 * 60 * 1000,
        }
      );
    }, 0);

    return () => {
      window.clearTimeout(requestId);
    };
  }, [location]);

  return { location, isRequesting, error };
}
