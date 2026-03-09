const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
                import.meta.env.VITE_GOOGLE_API_KEY || 
                import.meta.env.VITE_REACT_APP_API_KEY;

const FIELD_MASK = [
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.priceLevel',
  'places.photos',
  'places.location',
  'places.userRatingCount',
  'places.currentOpeningHours',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.editorialSummary',
].join(',');

export const fetchRestaurants = async (category = 'restaurant', lat, lng) => {
  const searchUrl = 'https://places.googleapis.com/v1/places:searchNearby';

  const safeLat = parseFloat(lat) || 53.4808;
  const safeLng = parseFloat(lng) || -2.2426;

  const typeMapping = {
    'restaurant': ['restaurant'],
    'cafe':       ['cafe', 'bakery'],
    'bar':        ['bar'],
    'breakfast':  ['restaurant', 'cafe', 'bakery'], 
  };

  const selectedTypes = typeMapping[category] || ['restaurant'];

  try {
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': FIELD_MASK
      },
      body: JSON.stringify({
        includedPrimaryTypes: selectedTypes,
        excludedPrimaryTypes: ['lodging', 'hotel', 'shopping_mall'],
        maxResultCount: 20, 
        locationRestriction: {
          circle: {
            center: { latitude: safeLat, longitude: safeLng },
            radius: 1000.0
          }
        }
      })
    });

    const data = await response.json();
    return data.places || [];

  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
};

export const searchRestaurantsByText = async (query, lat, lng) => {
  const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
  
  const safeLat = parseFloat(lat) || 53.4808;
  const safeLng = parseFloat(lng) || -2.2426;

  try {
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': FIELD_MASK
      },
      body: JSON.stringify({
        textQuery: query,
        locationBias: {
          circle: {
            center: { latitude: safeLat, longitude: safeLng },
            radius: 5000.0 
          }
        }
      })
    });

    const data = await response.json();
    return data.places || [];

  } catch (error) {
    console.error("Error searching places by text:", error);
    return [];
  }
};