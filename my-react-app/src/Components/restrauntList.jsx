import { useEffect, useState } from 'react';
import { fetchRestaurants } from '../restaurantService';
import { useNavigate } from 'react-router-dom';




//Create a variable to store the navigate function


//arrow function to handle card click and send to about page based on the card click

import '../styles/RestaurantList.css'; 

const RestaurantList = () => {
  // State to hold the list of places from the API
  const navigate=useNavigate();

  const handleCardClick = (place) => {
    navigate('/about', { state: { place } })
  
  };


  const [restaurants, setRestaurants] = useState([]);
  
  // State to track which filter is currently active (default: 'restaurant')
  const [activeFilter, setActiveFilter] = useState('restaurant');
  
  // Loading state to show feedback while data is fetching
  const [loading, setLoading] = useState(false);
  
  const apiKey = "AIzaSyA2X0sOogCnixLAXeKBgmMH3GfJs1l2YPI";

  // Initial load: Fetch restaurants when the component first mounts
  useEffect(() => {
    loadData(activeFilter);
  }, []);

  /**
   * Fetches data from the Google Places API based on the selected category.
   * @param {string} category - The type of place to search for (e.g., 'cafe', 'bar')
   */
  const loadData = async (category) => {
    setLoading(true);
    const data = await fetchRestaurants(category);
    console.log(data);
    setRestaurants(data);
    setLoading(false);
  };

  /**
   * Handles the filter button click.
   * Prevents re-fetching if the user clicks the already active filter.
   */
  const handleFilterClick = (category) => {
    if (category === activeFilter) return;
    setActiveFilter(category);
    loadData(category);
  };

  // Helper to construct the photo URL using the Google Places Media API
  const getPhotoUrl = (place) => {
    if (place.photos && place.photos.length > 0) {
        const photoRef = place.photos[0].name;
        return `https://places.googleapis.com/v1/${photoRef}/media?key=${apiKey}&maxHeightPx=400&maxWidthPx=400`;
    }
    // Fallback image if no photo exists
    return "https://via.placeholder.com/300x400?text=No+Image";
  };

 

  // Helper to convert price levels (e.g., "PRICE_LEVEL_MODERATE") into symbols (££)
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
      
      {/* FILTER SECTION: Buttons to switch between categories */}
      <div className="filter-section">
        <div className="filter-row">
          {['Restaurant', 'Cafe', 'Bar', 'Breakfast'].map((type) => (
            <button 
              key={type}
              onClick={() => handleFilterClick(type.toLowerCase())}
              className={`filter-btn ${activeFilter === type.toLowerCase() ? 'active' : ''}`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {/* LIST CONTENT: Displays the grid of cards */}
      {loading ? (
        <p>Loading amazing places...</p>
      ) : (
        <div className="gridContainer" >
          {restaurants.map((place, index) => (
            <div key={index} className="card" onClick={()=>handleCardClick(place)}>
              <div className="imageContainer">
                  <img 
                    src={getPhotoUrl(place)} 
                    alt={place.displayName?.text} 
                    className="card-image"
                    onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/300x400"}}
                  />
              </div>

              {/* Info Section */}
              <div className="card-content">
                <h3 className="place-name">{place.displayName?.text}</h3>
                
                <div className="stats-row">
                  <span className="stat-item">⭐ {place.rating}</span>
                  <span className="stat-item price-text">{formatPrice(place.priceLevel)}</span>
                </div>
                
                <p className="address-text">{place.formattedAddress}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;