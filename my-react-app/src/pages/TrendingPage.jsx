import { useEffect, useState } from 'react';
import { fetchRestaurants } from '../restaurantService';
import { useNavigate } from 'react-router-dom';
import '../styles/RestaurantList.css';

export default function TrendingPage() {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

    useEffect(() => {
        const load = async (lat, lng) => {
            const data = await fetchRestaurants('restaurant', lat, lng);
            const sorted = [...data]
                .filter(p => (p.userRatingCount || 0) > 200)
                .sort((a, b) => (b.rating || 0) - (a.rating || 0));
            setTrending(sorted);
            setLoading(false);
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => load(pos.coords.latitude, pos.coords.longitude),
                () => load(53.4808, -2.2426)
            );
        } else {
            load(53.4808, -2.2426);
        }
    }, []);

    const getPhotoUrl = (place) => {
        if (place.photos && place.photos.length > 0) {
            return `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${apiKey}&maxHeightPx=400&maxWidthPx=400`;
        }
        return 'https://via.placeholder.com/300x400?text=No+Image';
    };

    const formatPrice = (priceLevel) => {
        switch (priceLevel) {
            case 'PRICE_LEVEL_INEXPENSIVE': return '£';
            case 'PRICE_LEVEL_MODERATE': return '££';
            case 'PRICE_LEVEL_EXPENSIVE': return '£££';
            case 'PRICE_LEVEL_VERY_EXPENSIVE': return '££££';
            default: return '';
        }
    };

    return (
        <div style={{ paddingTop: '68px', minHeight: '100vh', background: '#f9f9f9', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px 40px 24px' }}>
                <h1 style={{ margin: '0 0 4px 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#1a1a1a' }}>Trending This Week</h1>
                <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>The highest rated spots near you right now</p>

                {loading ? (
                    <p style={{ textAlign: 'center', color: '#aaa', marginTop: '60px', fontSize: '16px' }}>Finding trending spots... 🔥</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                        {trending.map((place, index) => (
                            <div
                                key={index}
                                onClick={() => navigate('/about', { state: { place } })}
                                style={{
                                    background: 'white', borderRadius: '14px', overflow: 'hidden',
                                    boxShadow: '0 3px 14px rgba(0,0,0,0.08)', cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.13)'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 14px rgba(0,0,0,0.08)'; }}
                            >
                                <div style={{ position: 'relative', height: '180px', background: '#f0f0f0' }}>
                                    <img
                                        src={getPhotoUrl(place)}
                                        alt={place.displayName?.text}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400'; }}
                                    />
                                    {/* Rank badge */}
                                    <span style={{
                                        position: 'absolute', top: '10px', left: '10px',
                                        background: '#162167', color: 'white',
                                        padding: '4px 10px', borderRadius: '20px',
                                        fontWeight: 'bold', fontSize: '13px',
                                        fontFamily: 'Arial, Helvetica, sans-serif'
                                    }}>
                                        #{index + 1}
                                    </span>
                                    {/* Rating badge */}
                                    <span style={{
                                        position: 'absolute', bottom: '10px', right: '10px',
                                        background: 'white', padding: '3px 8px', borderRadius: '20px',
                                        fontWeight: 'bold', fontSize: '12px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                                        fontFamily: 'Arial, Helvetica, sans-serif'
                                    }}>
                                        ⭐ {place.rating} ({place.userRatingCount || 0})
                                    </span>
                                </div>
                                <div style={{ padding: '12px 14px' }}>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', fontWeight: 'bold', color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {place.displayName?.text}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                                        {formatPrice(place.priceLevel)} • {place.rating >= 4.5 ? 'Highly Rated' : 'Popular'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}