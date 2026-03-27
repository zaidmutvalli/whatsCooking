const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
                import.meta.env.VITE_GOOGLE_API_KEY || 
                import.meta.env.VITE_REACT_APP_API_KEY;

export const fetchRestaurants = async (category = 'restaurant', lat, lng) => {
    const searchUrl = 'https://places.googleapis.com/v1/places:searchNearby';

    const typeMapping = {
        'restaurant': ['restaurant'],
        'cafe': ['cafe', 'bakery', 'coffee_shop'],
        'bar': ['bar', 'pub', 'wine_bar'],
        'breakfast': ['bakery', 'cafe', 'restaurant'],
    };

    const selectedTypes = typeMapping[category] || ['restaurant'];

    try {
        const response = await fetch(searchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': API_KEY,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.photos,places.location,places.editorialSummary,places.userRatingCount'
            },
            body: JSON.stringify({
                includedPrimaryTypes: selectedTypes,
                excludedPrimaryTypes: [
                    'lodging', 'hotel', 'shopping_mall', 'department_store',
                    'movie_theater', 'supermarket', 'gym', 'clothing_store'
                ],
                locationRestriction: {
                    circle: {
                        center: { latitude: lat, longitude: lng },
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

    try {
        const response = await fetch(searchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': API_KEY,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.photos,places.location,places.editorialSummary,places.userRatingCount'
            },
            body: JSON.stringify({
                textQuery: query,
                locationBias: {
                    circle: {
                        center: { latitude: lat || 53.4808, longitude: lng || -2.2426 },
                        radius: 5000.0
                    }
                }
            })
        });

        const data = await response.json();
        return data.places || [];

    } catch (error) {
        console.error("Error searching places:", error);
        return [];
    }
};