
const API_KEY = "AIzaSyA2X0sOogCnixLAXeKBgmMH3GfJs1l2YPI";

export const fetchRestaurants = async () => {
  const url = 'https://places.googleapis.com/v1/places:searchNearby';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        // We list exactly what we want: Name, Address, Rating, Price
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.editorialSummary'
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
