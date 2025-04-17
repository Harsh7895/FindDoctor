interface Location {
  lat: number;
  lng: number;
}

interface PlaceResult {
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
  };
  geometry: {
    location: Location;
  };
  photos?: Array<{
    photo_reference: string;
  }>;
}

export interface Doctor {
  name: string;
  address: string;
  rating: number;
  totalRatings: number;
  isOpen: boolean | null;
  distance: string;
  location: Location;
  photoUrl: string | null;
}

export const searchDoctors = async (
  location: Location,
  specialty: string = '',
  radius: number = 5000
): Promise<Doctor[]> => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const keyword = specialty ? `doctor ${specialty}` : 'doctor';
    
    const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=doctor&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`;

    const proxyEndpoint = `${import.meta.env.VITE_BACKEND_URL}/api/places/search`;
    
    const response = await fetch(proxyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location,
        radius,
        keyword,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch doctors');
    }

    const data = await response.json();
    const results: PlaceResult[] = data.results || [];

    return results.map(place => {
      const photoReference = place.photos?.[0]?.photo_reference;
      const photoUrl = photoReference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`
        : null;

      // Calculate distance
      const distance = calculateDistance(
        location,
        place.geometry.location
      );

      return {
        name: place.name,
        address: place.vicinity,
        rating: place.rating || 0,
        totalRatings: place.user_ratings_total || 0,
        isOpen: place.opening_hours?.open_now ?? null,
        distance: `${distance.toFixed(1)} km`,
        location: place.geometry.location,
        photoUrl,
      };
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

function calculateDistance(origin: Location, destination: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(destination.lat - origin.lat);
  const dLng = toRad(destination.lng - origin.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(origin.lat)) * Math.cos(toRad(destination.lat)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(value: number): number {
  return value * Math.PI / 180;
}
