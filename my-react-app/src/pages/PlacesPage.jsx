import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';

const CATEGORY_STYLES = {
    restaurant: { bg: '#e74c3c', label: '🍽️' },
    cafe:       { bg: '#f39c12', label: '☕' },
    bar:        { bg: '#8e44ad', label: '🍺' },
    breakfast:  { bg: '#27ae60', label: '🥞' },
};

const TYPE_MAP = {
    restaurant: ['restaurant'],
    cafe:       ['cafe', 'bakery'],
    bar:        ['bar'],
    breakfast:  ['restaurant', 'cafe', 'bakery'],
};

// Generate a grid of search points around the user so results spread across the city
function getSearchGrid(centerLat, centerLng) {
    const points = [];
    // ~0.045 degrees lat ≈ 5km, ~0.07 degrees lng ≈ 5km in UK
    const offsets = [-0.09, -0.045, 0, 0.045, 0.09];
    for (const dLat of offsets) {
        for (const dLng of offsets) {
            points.push({ lat: centerLat + dLat, lng: centerLng + dLng });
        }
    }
    return points; // 25 grid points covering ~20x20km area
}

async function fetchAtPoint(category, lat, lng) {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
    try {
        const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': API_KEY,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.photos,places.location,places.userRatingCount'
            },
            body: JSON.stringify({
                includedPrimaryTypes: TYPE_MAP[category],
                excludedPrimaryTypes: ['lodging', 'hotel', 'shopping_mall'],
                maxResultCount: 20,
                locationRestriction: {
                    circle: {
                        center: { latitude: lat, longitude: lng },
                        radius: 2000
                    }
                }
            })
        });
        const data = await response.json();
        return (data.places || []).map(p => ({ ...p, category }));
    } catch {
        return [];
    }
}

function MapContent({ coords, activeCategories, apiKey }) {
    const map = useMap();
    const navigate = useNavigate();
    const [allPlaces, setAllPlaces] = useState([]);
    const [visiblePlaces, setVisiblePlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [zoom, setZoom] = useState(12);
    const [loadingCount, setLoadingCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const load = async () => {
            const grid = getSearchGrid(coords.lat, coords.lng);
            const categories = ['restaurant', 'cafe', 'bar', 'breakfast'];
            const total = grid.length * categories.length;
            setTotalCount(total);
            setLoadingCount(0);

            const seen = new Set();
            const allResults = [];

            // Fetch in batches to avoid rate limiting
            for (const point of grid) {
                const batchResults = await Promise.all(
                    categories.map(cat => fetchAtPoint(cat, point.lat, point.lng))
                );
                setLoadingCount(prev => prev + categories.length);

                batchResults.flat().forEach(p => {
                    const name = p.displayName?.text;
                    if (name && !seen.has(name) && p.location?.latitude) {
                        seen.add(name);
                        allResults.push(p);
                    }
                });
            }

            setAllPlaces(allResults);
        };
        load();
    }, [coords]);

    // Zoom listener
    useEffect(() => {
        if (!map) return;
        const listener = map.addListener('zoom_changed', () => setZoom(map.getZoom()));
        return () => listener.remove();
    }, [map]);

    // Filter by zoom level and active categories
    useEffect(() => {
        const filtered = allPlaces.filter(p => {
            if (!activeCategories.includes(p.category)) return false;
            const count = p.userRatingCount || 0;
            const rating = p.rating || 0;
            if (zoom >= 15) return true;
            if (zoom >= 14) return count > 50 || rating >= 4.2;
            if (zoom >= 13) return count > 200 || rating >= 4.4;
            if (zoom >= 12) return count > 500 || rating >= 4.6;
            return count > 2000 || rating >= 4.8;
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
            {/* Loading progress indicator */}
            {loadingCount < totalCount && totalCount > 0 && (
                <div style={{
                    position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                    background: 'white', padding: '8px 16px', borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontSize: '13px', fontWeight: 'bold',
                    color: '#162167', zIndex: 10, whiteSpace: 'nowrap'
                }}>
                    Loading places... {Math.round((loadingCount / totalCount) * 100)}%
                </div>
            )}

            {/* Total pin count */}
            {loadingCount >= totalCount && totalCount > 0 && (
                <div style={{
                    position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                    background: 'white', padding: '8px 16px', borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontSize: '13px', fontWeight: 'bold',
                    color: '#162167', zIndex: 10, whiteSpace: 'nowrap'
                }}>
                    {visiblePlaces.length} places shown · Zoom in for more
                </div>
            )}

            {/* User dot */}
            <AdvancedMarker position={coords}>
                <div style={{
                    width: '16px', height: '16px', background: '#162167',
                    border: '3px solid white', borderRadius: '50%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                }} />
            </AdvancedMarker>

            {/* Place markers */}
            {visiblePlaces.map((place, index) => {
                const lat = place.location?.latitude;
                const lng = place.location?.longitude;
                if (!lat || !lng) return null;
                const style = CATEGORY_STYLES[place.category];
                return (
                    <AdvancedMarker
                        key={index}
                        position={{ lat, lng }}
                        onClick={() => setSelectedPlace(place)}
                    >
                        <div style={{
                            background: selectedPlace === place ? '#162167' : style.bg,
                            color: 'white', borderRadius: '20px', padding: '4px 10px',
                            fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.25)', cursor: 'pointer',
                            border: '2px solid white'
                        }}>
                            {style.label} {place.rating || '?'}
                        </div>
                    </AdvancedMarker>
                );
            })}

            {/* Info popup */}
            {selectedPlace?.location && (
                <InfoWindow
                    position={{ lat: selectedPlace.location.latitude, lng: selectedPlace.location.longitude }}
                    onCloseClick={() => setSelectedPlace(null)}
                >
                    <div style={{ maxWidth: '220px', fontFamily: 'Arial, sans-serif' }}>
                        {getPhotoUrl(selectedPlace) && (
                            <img src={getPhotoUrl(selectedPlace)} alt={selectedPlace.displayName?.text}
                                style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                        )}
                        <p style={{ fontWeight: 'bold', margin: '0 0 3px 0', fontSize: '14px', color: '#111' }}>
                            {selectedPlace.displayName?.text}
                        </p>
                        <p style={{ margin: '0 0 3px 0', fontSize: '12px', color: '#666' }}>
                            ⭐ {selectedPlace.rating} · {selectedPlace.userRatingCount || 0} reviews
                        </p>
                        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#888' }}>
                            {selectedPlace.formattedAddress}
                        </p>
                        <button
                            onClick={() => navigate('/about', { state: { place: selectedPlace } })}
                            style={{
                                width: '100%', padding: '8px', background: '#162167', color: 'white',
                                border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
                            }}
                        >
                            View Restaurant →
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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => {}
            );
        }
    }, []);

    const toggleCategory = (cat) => {
        setActiveCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    return (
        <div style={{ paddingTop: '68px', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <div style={{ padding: '10px 24px 6px 24px', flexShrink: 0 }}>
                <h1 style={{ margin: '0 0 2px 0', fontSize: '1.4rem' }}>📍 Places Near You</h1>
            </div>
            <div style={{ padding: '6px 24px 10px 24px', display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                {Object.entries(CATEGORY_STYLES).map(([cat, style]) => (
                    <button key={cat} onClick={() => toggleCategory(cat)} style={{
                        padding: '6px 14px', borderRadius: '20px',
                        border: `2px solid ${style.bg}`,
                        background: activeCategories.includes(cat) ? style.bg : 'white',
                        color: activeCategories.includes(cat) ? 'white' : style.bg,
                        fontWeight: 'bold', fontSize: '13px', cursor: 'pointer',
                        textTransform: 'capitalize', width: 'auto'
                    }}>
                        {style.label} {cat}
                    </button>
                ))}
            </div>
            <div style={{ flex: 1, padding: '0 24px 24px 24px', minHeight: 0 }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', position: 'relative' }}>
                    <APIProvider apiKey={apiKey}>
                        <Map
                            defaultZoom={12}
                            defaultCenter={coords}
                            mapId={mapId}
                            gestureHandling="greedy"
                            style={{ width: '100%', height: '100%' }}
                        >
                            <MapContent coords={coords} activeCategories={activeCategories} apiKey={apiKey} />
                        </Map>
                    </APIProvider>
                </div>
            </div>
        </div>
    );
}