const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

/**
 * Fetches nearby places from Google Places API (New).
 * @param {string} category - The category to filter by (default: 'restaurant')
 * @returns {Array} - Array of place objects
 */
export const fetchRestaurants = async (category = 'restaurant') => {
  const searchUrl = 'https://places.googleapis.com/v1/places:searchNearby';

  // Mapping categories to specific Google Place Types
  const typeMapping = {
    'restaurant': ['restaurant'],
    'cafe':       ['cafe', 'bakery', 'coffee_shop'],
    'bar':        ['bar', 'pub', 'wine_bar'],
    'breakfast':  ['bakery', 'cafe', 'restaurant'], 
  };

  const selectedTypes = typeMapping[category] || ['restaurant'];

  try {
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        // Requesting only specific fields to save data bandwidth
        // Added places.location so we can use it for Map pins later
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.photos,places.location'
      },
      body: JSON.stringify({
        includedPrimaryTypes: selectedTypes,
        // EXCLUSION LIST: Blocking non-food venues that accidentally appear
        excludedPrimaryTypes: [
          'lodging', 'hotel', 'shopping_mall', 'department_store', 
          'movie_theater', 'supermarket', 'gym', 'clothing_store'
        ],
        // Defaulting to Google's standard result count (20) within 1km radius
        locationRestriction: {
          circle: {
            center: { latitude: 53.4808, longitude: -2.2426 },
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