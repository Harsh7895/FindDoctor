function getDistanceInKm(
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

const apiKey = "AIzaSyCRNCjEZpQqJUWV1NVj_V1-JDnqRl0qekU";
const origin = { lat: 27.147682, lng: 78.043877 };
const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${origin.lat},${origin.lng}&radius=5000&type=doctor&keyword=cardiologist&key=${apiKey}`;

fetch(endpoint)
  .then((res) => res.json())
  .then((data) => {
    const simplified = data.results.map(
      (place: {
        name: any;
        opening_hours: any;
        rating: any;
        user_ratings_total: any;
        vicinity: any;
        place_id: any;
        geometry: any;
        types: any;
        photos: any;
      }) => {
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
        const location = geometry.location;
        const distance = getDistanceInKm(
          origin.lat,
          origin.lng,
          location.lat,
          location.lng
        );
        const imageUrl = photos?.[0]
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photos[0].photo_reference}&key=${apiKey}`
          : null;

        return {
          name,
          open_now: opening_hours?.open_now ?? "unknown",
          rating,
          user_ratings_total,
          location,
          vicinity,
          place_id,
          types,
          distance_km: distance,
          imageUrl,
        };
      }
    );

    console.log(simplified);
  })
  .catch((error) => {
    console.error("Error fetching places:", error);
  });
