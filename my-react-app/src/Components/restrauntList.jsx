import { useEffect, useState } from 'react';
import { fetchRestaurants } from '../restaurantService';
import { useNavigate } from 'react-router-dom';
import '../styles/RestaurantList.css'; 

const RestaurantList = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [activeFilter, setActiveFilter] = useState('restaurant');
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

  const handleCardClick = (place) => {
    navigate('/about', { state: { place } });
  };

  useEffect(() => {
    loadData(activeFilter);
  }, []);

  const loadData = async (category) => {
    setLoading(true);
    const data = await fetchRestaurants(category);
    setRestaurants(data);
    setLoading(false);
  };

  const handleFilterClick = (category) => {
    if (category === activeFilter) return;
    setActiveFilter(category);
    loadData(category);
  };

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
          <p className="loading-text">Loading...</p>
        ) : (
          <div className="horizontal-scroll-row">
            {restaurants.map((place, index) => (
              <div key={index} className="restaurant-horizontal-card" onClick={() => handleCardClick(place)}>
                <div className="img-wrapper">
                  {/* We keep the IMG tag but add a class that we will FORCE to size in CSS */}
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