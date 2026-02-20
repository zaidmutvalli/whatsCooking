import { useEffect, useState } from 'react';
import { fetchRestaurants } from '../restaurantService';
import { useNavigate } from 'react-router-dom';
import '../styles/RestaurantList.css'; 

const RestaurantList = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [activeFilter, setActiveFilter] = useState('restaurant');
  const [loading, setLoading] = useState(false);
  // Add a state to store user location
  const [userCoords, setUserCoords] = useState(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

  const handleCardClick = (place) => {
    navigate('/about', { state: { place } });
  };

  // STEP 1: Get location when the component first mounts
  useEffect(() => {
  const getInitialData = () => {
    setLoading(true); // Start loading immediately
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          
          // FETCH IMMEDIATELY once we have coords
          await loadData(activeFilter, latitude, longitude);
        },
        async (error) => {
          console.error("Location denied, using fallback");
          const fallbackLat = 53.4808;
          const fallbackLng = -2.2426;
          setUserCoords({ lat: fallbackLat, lng: fallbackLng });
          await loadData(activeFilter, fallbackLat, fallbackLng);
        }
      );
    } else {
      loadData(activeFilter, 53.4808, -2.2426);
    }
  };

  getInitialData();
}, []); // Empty dependency array means this only runs once on mount

  // STEP 2: Update loadData to accept lat/lng
  const loadData = async (category, lat, lng) => {
    setLoading(true);
    // Use coordinates if they exist, otherwise use fallback
    const latitude = lat || userCoords?.lat || 53.4808;
    const longitude = lng || userCoords?.lng || -2.2426;
    
    const data = await fetchRestaurants(category, latitude, longitude);
    setRestaurants(data);
    setLoading(false);
  };

  const handleFilterClick = (category) => {
    if (category === activeFilter) return;
    setActiveFilter(category);
    // Use existing stored coords when switching filters
    loadData(category, userCoords?.lat, userCoords?.lng);
  };

  // ... (keep getPhotoUrl and formatPrice the same)

  const getPhotoUrl = (place) => {
    if (place.photos && place.photos.length > 0) {
        const photoRef = place.photos[0].name;
        return `https://places.googleapis.com/v1/${photoRef}/media?key=${apiKey}&maxHeightPx=400&maxWidthPx=400`;
    }
    return "https://via.placeholder.com/300x400?text=No+Image";
  };

  const formatPrice = (priceLevel) => {
      switch (priceLevel) {
          case 'PRICE_LEVEL_INEXPENSIVE': return '£';
          case 'PRICE_LEVEL_MODERATE':    return '££';
          case 'PRICE_LEVEL_EXPENSIVE':   return '£££';
          case 'PRICE_LEVEL_VERY_EXPENSIVE': return '££££';
          default: return '';
      }
  };

  return (
    <div className="restaurant-list-container">
      <div className="filter-section">
        <div className="filter-row">
          {['Restaurant', 'Cafe', 'Bar', 'Breakfast'].map((type) => (
            <button 
              key={type}
              onClick={() => handleFilterClick(type.toLowerCase())}
              className={`filter-btn ${activeFilter === type.toLowerCase() ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="category-row">
        <h2 className="row-title">Recommended {activeFilter}s Near You</h2>
        
        {loading ? (
          <p className="loading-text">Finding spots nearby... 📍</p>
        ) : (
          <div className="horizontal-scroll-row">
            {restaurants.map((place, index) => (
              <div key={index} className="restaurant-horizontal-card" onClick={() => handleCardClick(place)}>
                <div className="img-wrapper">
                  <img 
                    src={getPhotoUrl(place)} 
                    alt={place.displayName?.text} 
                    className="fixed-size-img"
                    onError={(e) => {e.target.src="https://via.placeholder.com/300x400"}}
                  />
                  <span className="rating-badge">⭐ {place.rating}</span>
                </div>
                <div className="card-info">
                  <h4>{place.displayName?.text}</h4>
                  <p>{formatPrice(place.priceLevel)} • {activeFilter}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;