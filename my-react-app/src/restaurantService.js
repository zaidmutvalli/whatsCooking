export const fetchRestaurants = async (category = 'restaurant') => {
  const searchUrl = 'https://places.googleapis.com/v1/places:searchNearby';

  const typeMapping = {
    restaurant: ['restaurant'],
    cafe: ['cafe', 'bakery'],
    bar: ['bar'],
    breakfast: ['bakery', 'cafe', 'restaurant'],
  };

  const selectedTypes = typeMapping[category] || ['restaurant'];

  try {
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_API_KEY,
        'X-Goog-FieldMask':
          'places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.photos,places.editorialSummary,places.addressComponents',
      },
      body: JSON.stringify({
        includedPrimaryTypes: selectedTypes,
        excludedPrimaryTypes: [
          'lodging',
          'shopping_mall',
          'department_store',
          'movie_theater',
          'supermarket',
          'gym',
          'clothing_store',
        ],
        locationRestriction: {
          circle: {
            center: { latitude: 53.4808, longitude: -2.2426 },
            radius: 1000,
          },
        },
      }),
    });

    if (!response.ok) {
      console.error(await response.text());
    }

    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
};
