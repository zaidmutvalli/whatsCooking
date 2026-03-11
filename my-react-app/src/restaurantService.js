const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
                import.meta.env.VITE_GOOGLE_API_KEY || 
                import.meta.env.VITE_REACT_APP_API_KEY;

// Fields for restaurant cards
const FIELD_MASK = [
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.priceLevel',
  'places.photos',           
  'places.location',
  'places.userRatingCount'
].join(',');

export const fetchRestaurants = async (category = 'restaurant', lat, lng) => {
  const searchUrl = 'https://places.googleapis.com/v1/places:searchNearby';

  // Use Manchester as default location if geolocation doesn't work
  let safeLat = 53.4808;
  let safeLng = -2.2426;

  if (lat && lng) {
    safeLat = parseFloat(lat);
    safeLng = parseFloat(lng);
  }

  const typeMapping = {
    'restaurant': ['restaurant'],
    'cafe':       ['cafe', 'bakery', 'coffee_shop'],
    'bar':        ['bar', 'pub'],
    'breakfast':  ['bakery', 'cafe', 'restaurant']
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
    console.error("Error fetching restaurants:", error);
    return [];
  }
};

// Text search for the search bar at the top
export const searchRestaurantsByText = async (query, lat, lng) => {
  const searchUrl = 'https://places.googleapis.com/v1/places:searchText';

  let safeLat = 53.4808;
  let safeLng = -2.2426;

  if (lat && lng) {
    safeLat = parseFloat(lat);
    safeLng = parseFloat(lng);
  }

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
    console.error("Error in text search:", error);
    return [];
  }
};