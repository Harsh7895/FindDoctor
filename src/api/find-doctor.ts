export function getDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2); // distance in km
}

interface Location {
  lat: number;
  lng: number;
}

export async function findNearbyDoctors(location: Location, specialty: string = '') {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('Google Places API key is not configured');
  }

  // Use a proxy URL that will be handled by your backend
  const proxyUrl = `${import.meta.env.VITE_BACKEND_URL}/api/places/search`;
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location,
        specialty,
        radius: 5000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch doctors');
    }

    const data = await response.json();
    return data.results.map((place: any) => {
      const {
        name,
        opening_hours,
        rating,
        user_ratings_total,
        vicinity,
        place_id,
        geometry,
        types,
        photos,
      } = place;

      const placeLocation = geometry.location;
      const distance = getDistanceInKm(
        location.lat,
        location.lng,
        placeLocation.lat,
        placeLocation.lng
      );

      const imageUrl = photos?.[0]
        ? `${import.meta.env.VITE_BACKEND_URL}/api/places/photo?reference=${photos[0].photo_reference}`
        : null;

      return {
        name,
        open_now: opening_hours?.open_now ?? "unknown",
        rating,
        user_ratings_total,
        location: placeLocation,
        vicinity,
        place_id,
        types,
        distance_km: distance,
        imageUrl,
      };
    });
  } catch (error) {
    console.error('Error finding nearby doctors:', error);
    throw error;
  }
}

// Example usage:
const origin: Location = { lat: 27.147682, lng: 78.043877 };
findNearbyDoctors(origin, 'cardiologist')
  .then((doctors) => console.log(doctors))
  .catch((error) => console.error(error));
