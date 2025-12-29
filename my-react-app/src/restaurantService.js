
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const fetchRestaurants = async () => {

  const url = 'https://places.googleapis.com/v1/places:searchNearby';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
   
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.priceLevel'
      },
      body: JSON.stringify({
        includedTypes: ['restaurant'],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: { latitude: 53.4808, longitude: -2.2426 },
            radius: 1500.0
          }
        }
      })
    });

    const data = await response.json();
    
    return data.places || []; 
    
  } catch (error) {
    console.error("Oh no! Something went wrong:", error);
    return [];
  }
};