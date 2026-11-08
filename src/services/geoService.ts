/**
 * Geolocation & Haversine Distance Service
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface GeolocationResult {
  coords?: Coordinates;
  error?: string;
  isAvailable: boolean;
}

// Haversine formula to calculate distance in meters between two lat/lon pairs
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Maximum distance in meters to consider a reporter "on-site"
export const GPS_VERIFIED_RADIUS_METERS = 1500; // 1.5 km

export function isWithinDestinationProximity(
  userLat: number,
  userLon: number,
  destLat: number,
  destLon: number
): { isWithin: boolean; distanceMeters: number } {
  const distanceMeters = calculateDistanceMeters(userLat, userLon, destLat, destLon);
  return {
    isWithin: distanceMeters <= GPS_VERIFIED_RADIUS_METERS,
    distanceMeters
  };
}

export function getCurrentUserLocation(): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        isAvailable: false,
        error: 'Geolocation is not supported by your browser.'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          isAvailable: true,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          }
        });
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can still submit an unverified remote report.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        resolve({
          isAvailable: false,
          error: msg
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  });
}
