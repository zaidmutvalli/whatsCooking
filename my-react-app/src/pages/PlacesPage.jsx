import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';

const CATEGORY_STYLES = {
    restaurant: { bg: '#e74c3c', label: 'Restaurants' },
    cafe: { bg: '#f39c12', label: 'Cafes' },
    bar: { bg: '#8e44ad', label: 'Bars' },
    breakfast: { bg: '#27ae60', label: 'Breakfast' }
};

const TYPE_MAP = {
    restaurant: ['restaurant'],
    cafe: ['cafe', 'bakery'],
    bar: ['bar'],
    breakfast: ['breakfast_restaurant', 'brunch_restaurant', 'bakery']
};

async function fetchAtPoint(category, lat, lng) {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
    try {
        const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': key,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.photos,places.location,places.userRatingCount'
            },
            body: JSON.stringify({
                includedPrimaryTypes: TYPE_MAP[category],
                excludedPrimaryTypes: ['lodging', 'hotel', 'shopping_mall'],
                maxResultCount: 20,
                locationRestriction: {
                    circle: {
                        center: { latitude: lat, longitude: lng },
                        radius: 3000
                    }
                }
            })
        });
        const data = await res.json();
        return (data.places || []).map(p => ({ ...p, category }));
    } catch {
        return [];
    }
}

// had to move this into its own component bc useMap() only works inside APIProvider
function MapContent({ coords, activeCategories, apiKey }) {
    const map = useMap();
    const navigate = useNavigate();
    const [allPlaces, setAllPlaces] = useState([]);
    const [visiblePlaces, setVisiblePlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [zoom, setZoom] = useState(12);

    useEffect(() => {
        const load = async () => {
            const results = [];
            for (const cat of ['restaurant', 'cafe', 'bar', 'breakfast']) {
                if (activeCategories.includes(cat)) {
                    const places = await fetchAtPoint(cat, coords.lat, coords.lng);
                    results.push(...places);
                }
            }
            setAllPlaces(results);
        };
        load();
    }, [coords, activeCategories]);

    useEffect(() => {
        if (!map) return;
        const listener = map.addListener('zoom_changed', () => setZoom(map.getZoom()));
        return () => listener.remove();
    }, [map]);

    useEffect(() => {
        const filtered = allPlaces.filter(p => {
            if (!activeCategories.includes(p.category)) return false;
            const count = p.userRatingCount || 0;
            const rating = p.rating || 0;
            // got thresholds through trial and error
            if (zoom >= 15) return true;
            if (zoom >= 13) return count > 100 || rating >= 4.3;
            return count > 400 || rating >= 4.5;
        });
        setVisiblePlaces(filtered);
    }, [zoom, allPlaces, activeCategories]);

    const getPhotoUrl = (place) => {
        if (place.photos?.length > 0) {
            return `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${apiKey}&maxHeightPx=200&maxWidthPx=200`;
        }
        return null;
    };

    return (
        <>
            {visiblePlaces.map((place, i) => {
                const lat = place.location?.latitude;
                const lng = place.location?.longitude;
                if (!lat || !lng) return null;

                const style = CATEGORY_STYLES[place.category];
                const isSelected = selectedPlace === place;

                return (
                    <AdvancedMarker
                        key={i}
                        position={{ lat, lng }}
                        onClick={() => setSelectedPlace(place)}
                    >
                        <div style={{
                            background: isSelected ? '#162167' : style.bg,
                            color: 'white',
                            borderRadius: '20px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                            cursor: 'pointer',
                            border: '2px solid white'
                        }}>
                            {place.rating || '?'} ★
                        </div>
                    </AdvancedMarker>
                );
            })}

            {selectedPlace && (
                <InfoWindow
                    position={{
                        lat: selectedPlace.location.latitude,
                        lng: selectedPlace.location.longitude
                    }}
                    onCloseClick={() => setSelectedPlace(null)}
                >
                    <div style={{ maxWidth: '200px' }}>
                        {getPhotoUrl(selectedPlace) && (
                            <img
                                src={getPhotoUrl(selectedPlace)}
                                alt={selectedPlace.displayName?.text}
                                style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                            />
                        )}
                        <p style={{ fontWeight: 'bold', margin: '0 0 2px 0', fontSize: '13px' }}>
                            {selectedPlace.displayName?.text}
                        </p>
                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
                            ⭐ {selectedPlace.rating} · {selectedPlace.userRatingCount || 0} reviews
                        </p>
                        <button
                            onClick={() => navigate('/about', { state: { place: selectedPlace } })}
                            style={{
                                width: '100%',
                                padding: '7px',
                                background: '#162167',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            View →
                        </button>
                    </div>
                </InfoWindow>
            )}
        </>
    );
}

export default function PlacesPage() {
    const [coords, setCoords] = useState({ lat: 53.4808, lng: -2.2426 });
    const [activeCategories, setActiveCategories] = useState(['restaurant', 'cafe', 'bar', 'breakfast']);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
    const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;

    useEffect(() => {
        navigator.geolocation?.getCurrentPosition(
            (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        );
    }, []);

    const toggleCategory = (cat) => {
        setActiveCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    return (
        <div style={{
            paddingTop: '68px',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'Arial, Helvetica, sans-serif'
        }}>
            <div style={{ padding: '12px 20px 8px 20px' }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: 'bold' }}>
                    Places Near You
                </h1>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {Object.entries(CATEGORY_STYLES).map(([cat, style]) => {
                        const active = activeCategories.includes(cat);
                        return (
                            <button
                                key={cat}
                                onClick={() => toggleCategory(cat)}
                                style={{
                                    width: 'auto',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    border: `2px solid ${style.bg}`,
                                    background: active ? style.bg : 'white',
                                    color: active ? 'white' : style.bg,
                                    fontWeight: '600',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    opacity: active ? 1 : 0.6,
                                    flexShrink: 0
                                }}
                            >
                                {style.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={{ flex: 1, padding: '8px 20px 20px 20px' }}>
                <APIProvider apiKey={apiKey}>
                    <Map
                        defaultZoom={12}
                        defaultCenter={coords}
                        mapId={mapId}
                        style={{ width: '100%', height: '100%', borderRadius: '12px' }}
                    >
                        <MapContent coords={coords} activeCategories={activeCategories} apiKey={apiKey} />
                    </Map>
                </APIProvider>
            </div>
        </div>
    );
}