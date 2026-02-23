import { useEffect, useState, useRef } from 'react';
import { fetchRestaurants, searchRestaurantsByText } from '../restaurantService';
import { useNavigate } from 'react-router-dom';
import '../styles/RestaurantList.css'; 

const CUISINE_MAP = {
  'italian': 'italian restaurant', 'pizza': 'pizza restaurant', 'pasta': 'italian restaurant',
  'chinese': 'chinese restaurant', 'indian': 'indian restaurant', 'curry': 'indian restaurant',
  'japanese': 'japanese restaurant', 'sushi': 'sushi restaurant', 'ramen': 'ramen restaurant',
  'thai': 'thai restaurant', 'mexican': 'mexican restaurant', 'tacos': 'mexican restaurant',
  'american': 'american restaurant', 'burger': 'burger restaurant', 'burgers': 'burger restaurant',
  'turkish': 'turkish restaurant', 'kebab': 'turkish restaurant', 'greek': 'greek restaurant',
  'french': 'french restaurant', 'spanish': 'spanish restaurant', 'tapas': 'tapas restaurant',
  'korean': 'korean restaurant', 'vietnamese': 'vietnamese restaurant', 'pho': 'vietnamese restaurant',
  'lebanese': 'lebanese restaurant', 'moroccan': 'moroccan restaurant',
  'persian': 'persian restaurant', 'pakistani': 'pakistani restaurant',
  'steak': 'steakhouse', 'seafood': 'seafood restaurant', 'fish': 'fish restaurant',
  'noodles': 'noodle restaurant', 'dumpling': 'dumpling restaurant', 'dim sum': 'dim sum restaurant',
  'brunch': 'brunch restaurant', 'breakfast': 'breakfast restaurant', 'pancakes': 'breakfast cafe',
  'vegan': 'vegan restaurant', 'vegetarian': 'vegetarian restaurant', 'halal': 'halal restaurant',
  'bbq': 'bbq restaurant', 'wings': 'chicken wings restaurant', 'chicken': 'chicken restaurant',
  'coffee': 'coffee shop', 'cafe': 'cafe', 'cocktails': 'cocktail bar', 'bar': 'bar',
};


// Reads click history from localStorage and returns the top interest
const getTopInterest = () => {
  try {
    const raw = localStorage.getItem('wc_interests');
    if (!raw) return null;
    const interests = JSON.parse(raw);
    // Sort by count descending, return the top one
    const sorted = Object.entries(interests).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : null;
  } catch {
    return null;
  }
};

// Records a click for a given interest category
const recordInterest = (place) => {
  try {
    const raw = localStorage.getItem('wc_interests');
    const interests = raw ? JSON.parse(raw) : {};

    // Track price level interest
    const price = place.priceLevel;
    if (price) {
      interests[price] = (interests[price] || 0) + 1;
    }

    // Track category tab interest (stored separately)
    const raw2 = localStorage.getItem('wc_tab_interests');
    const tabInterests = raw2 ? JSON.parse(raw2) : {};

    localStorage.setItem('wc_interests', JSON.stringify(interests));
  } catch {}
};

const recordTabInterest = (category) => {
  try {
    const raw = localStorage.getItem('wc_tab_interests');
    const interests = raw ? JSON.parse(raw) : {};
    interests[category] = (interests[category] || 0) + 1;
    localStorage.setItem('wc_tab_interests', JSON.stringify(interests));
  } catch {}
};

const getTopTabInterest = () => {
  try {
    const raw = localStorage.getItem('wc_tab_interests');
    if (!raw) return null;
    const interests = JSON.parse(raw);
    const sorted = Object.entries(interests).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : null;
  } catch {
    return null;
  }
};

const PRICE_LABEL = {
  'PRICE_LEVEL_INEXPENSIVE': { label: 'budget-friendly', search: 'cheap eats restaurant' },
  'PRICE_LEVEL_MODERATE':    { label: 'mid-range',       search: 'casual dining restaurant' },
  'PRICE_LEVEL_EXPENSIVE':   { label: 'upscale dining',  search: 'fine dining restaurant' },
  'PRICE_LEVEL_VERY_EXPENSIVE': { label: 'luxury dining', search: 'luxury restaurant' },
};

const RestaurantList = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [recentViewName, setRecentViewName] = useState(null);
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [activeFilter, setActiveFilter] = useState('restaurant');
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState(null); // null = all
  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allLoadedPlaces, setAllLoadedPlaces] = useState([]);
  const searchRef = useRef(null);


  const [pickedForYou, setPickedForYou] = useState([]);
  const [pickedLabel, setPickedLabel] = useState('');


  const [friendsReviewedPlaces, setFriendsReviewedPlaces] = useState([]);
  const [friendsVisitedPlaces, setFriendsVisitedPlaces] = useState([]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

  const handleCardClick = (place) => {
  
    recordInterest(place);

  
    navigate('/about', { state: { place } });

    fetch("http://localhost:8888/track_view.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        restaurant_id: place.name,
        restaurant_name: place.displayName?.text
      })
    }).catch(() => {}); 
  };

  useEffect(() => {
    const getInitialData = () => {
      setLoading(true); 
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserCoords({ lat: latitude, lng: longitude });
            await loadData(activeFilter, latitude, longitude);
            await loadRecommendations(latitude, longitude);
            await loadPickedForYou(latitude, longitude, activeFilter);
            await loadFriendsData(latitude, longitude);
          },
          async () => {
            setUserCoords({ lat: 53.4808, lng: -2.2426 });
            await loadData(activeFilter, 53.4808, -2.2426);
            await loadRecommendations(53.4808, -2.2426);
            await loadPickedForYou(53.4808, -2.2426, activeFilter);
            await loadFriendsData(53.4808, -2.2426);
          }
        );
      } else {
        loadData(activeFilter, 53.4808, -2.2426);
        loadRecommendations(53.4808, -2.2426);
        loadPickedForYou(53.4808, -2.2426, activeFilter);
      }
    };
    getInitialData();

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); 

  
  // This runs whenever restaurants or activeFilter changes — no extra API calls needed
  const buildPickedForYou = (data, currentFilter) => {
    const topPrice = getTopInterest();

    if (topPrice && PRICE_LABEL[topPrice]) {
      // Filter current tab's data by the user's preferred price level
      const filtered = data
        .filter(p => p.priceLevel === topPrice)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 10);

      if (filtered.length >= 3) {
        setPickedForYou(filtered);
        setPickedLabel(`🎯 Picked for you · ${PRICE_LABEL[topPrice].label} ${currentFilter}s`);
        return;
      }
    }

    // Fallback: show highest rated from current tab
    const topRated = [...data]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);

    // Only show if we have interest data at all
    const hasInterest = localStorage.getItem('wc_interests') || localStorage.getItem('wc_tab_interests');
    if (hasInterest && topRated.length > 0) {
      setPickedForYou(topRated);
      setPickedLabel(`🎯 Picked for you · top ${currentFilter}s`);
    } else {
      setPickedForYou([]);
    }
  };

  // Keep loadPickedForYou as a no-op stub so existing calls don't break
  const loadPickedForYou = async (lat, lng, currentFilter) => {};

 
  const loadFriendsData = async (lat, lng) => {
    try {
      const res = await fetch('http://localhost:8888/get_social_feed.php', { credentials: 'include' });
      const data = await res.json();
      if (data.status === 'success') {
        // Get unique restaurant names from reviews, then match to loaded places
        const reviewedNames = [...new Set(data.reviews.map(r => r.restaurant_name))];
        const visitedNames = [...new Set(data.visits.map(v => v.restaurant_name))];
        setFriendsReviewedPlaces(reviewedNames);
        setFriendsVisitedPlaces(visitedNames);
      }
    } catch (e) {
      console.error('Failed to load friends data', e);
    }
  };

  const loadRecommendations = async (lat, lng) => {
    try {
      const res = await fetch("http://localhost:8888/get_recent_view.php", { credentials: "include" });
      const data = await res.json();
      if (data.status === "success" && data.recent_view) {
        setRecentViewName(data.recent_view);
        const similarPlaces = await searchRestaurantsByText(`places similar to ${data.recent_view}`, lat, lng);
        setRecommendedPlaces(similarPlaces.filter(p => p.displayName?.text !== data.recent_view));
      }
    } catch (error) {
      console.error("Failed to load recommendations", error);
    }
  };

  const loadData = async (category, lat, lng) => {
    setLoading(true);
    setIsSearching(false);
    const latitude = lat || userCoords?.lat || 53.4808;
    const longitude = lng || userCoords?.lng || -2.2426;
    const data = await fetchRestaurants(category, latitude, longitude);
    setRestaurants(data);
    setAllLoadedPlaces(prev => {
      const seen = new Set(prev.map(p => p.displayName?.text));
      const newOnes = data.filter(p => !seen.has(p.displayName?.text));
      return [...prev, ...newOnes];
    });
    buildPickedForYou(data, category);
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const q = query.toLowerCase().trim();
    const cuisineMatch = Object.keys(CUISINE_MAP).find(k => k.includes(q) || q.includes(k));
    const nameMatches = allLoadedPlaces.filter(p => {
      const name = p.displayName?.text?.toLowerCase() || '';
      const address = p.formattedAddress?.toLowerCase() || '';
      return name.includes(q) || address.includes(q);
    }).slice(0, cuisineMatch ? 3 : 6);
    const cuisineSuggestions = cuisineMatch ? [{
      _isCuisineSearch: true,
      _searchTerm: CUISINE_MAP[cuisineMatch],
      displayName: { text: `Search "${CUISINE_MAP[cuisineMatch]}" near you` },
      formattedAddress: `Tap to find all ${CUISINE_MAP[cuisineMatch]}s`,
      rating: null
    }] : [];
    setSuggestions([...cuisineSuggestions, ...nameMatches]);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = async (place) => {
    setShowSuggestions(false);
    if (place._isCuisineSearch) {
      setSearchQuery(place._searchTerm);
      setLoading(true);
      setIsSearching(true);
      const data = await searchRestaurantsByText(place._searchTerm, userCoords?.lat, userCoords?.lng);
      setRestaurants(data);
      setLoading(false);
    } else {
      setSearchQuery(place.displayName?.text || '');
      setIsSearching(true);
      setRestaurants([place]);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault(); 
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    const q = searchQuery.toLowerCase().trim();
    const cuisineMatch = Object.keys(CUISINE_MAP).find(k => k.includes(q) || q.includes(k));
    const searchTerm = cuisineMatch ? CUISINE_MAP[cuisineMatch] : searchQuery;
    setLoading(true);
    setIsSearching(true);
    const data = await searchRestaurantsByText(searchTerm, userCoords?.lat, userCoords?.lng);
    setRestaurants(data);
    setLoading(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSuggestions([]);
    setShowSuggestions(false);
    loadData(activeFilter, userCoords?.lat, userCoords?.lng);
  };

  const handleFilterClick = (category) => {
    if (category === activeFilter && !isSearching) return;
    recordTabInterest(category); // Task 4: track tab clicks
    setSearchQuery(''); 
    setActiveFilter(category);
    loadData(category, userCoords?.lat, userCoords?.lng);
    // Refresh picked-for-you row for the new tab
    loadPickedForYou(userCoords?.lat || 53.4808, userCoords?.lng || -2.2426, category);
  };

  const getPhotoUrl = (place) => {
    if (place.photos && place.photos.length > 0) {
      return `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${apiKey}&maxHeightPx=400&maxWidthPx=400`;
    }
    return "https://via.placeholder.com/300x400?text=No+Image";
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

  // Apply open now + price filters
  const filteredRestaurants = restaurants.filter(p => {
    if (openNowOnly && p.currentOpeningHours?.openNow === false) return false;
    if (priceFilter && p.priceLevel !== priceFilter) return false;
    return true;
  });

  const popularPlaces = [...filteredRestaurants].sort((a, b) => (b.userRatingCount || 0) - (a.userRatingCount || 0)).slice(0, 10);
  const topRatedPlaces = [...filteredRestaurants].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
  const hiddenGems = [...filteredRestaurants].filter(p => (p.rating || 0) >= 4.4 && (p.userRatingCount || 0) < 500).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
  const budgetFriendly = [...filteredRestaurants].filter(p => p.priceLevel === 'PRICE_LEVEL_INEXPENSIVE').sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
  const fineDining = [...filteredRestaurants].filter(p => p.priceLevel === 'PRICE_LEVEL_EXPENSIVE' || p.priceLevel === 'PRICE_LEVEL_VERY_EXPENSIVE').sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
  const localPlaces = filteredRestaurants.slice(0, 10);

  const CategoryRow = ({ title, data }) => {
    if (!data || data.length === 0) return null; 
    return (
      <div className="category-row">
        <h2 className="row-title">{title}</h2>
        <div className="horizontal-scroll-row">
          {data.map((place, index) => (
            <div key={index} className="restaurant-horizontal-card" onClick={() => handleCardClick(place)}>
              <div className="img-wrapper">
                <img 
                  src={getPhotoUrl(place)} 
                  alt={place.displayName?.text} 
                  className="fixed-size-img"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300x400" }}
                />
                <span className="rating-badge">⭐ {place.rating} ({place.userRatingCount || 0})</span>
              </div>
              <div className="card-info">
                <h4>{place.displayName?.text}</h4>
                <p>{formatPrice(place.priceLevel)} • {place.rating >= 4.5 ? 'Highly Rated' : 'Popular'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="restaurant-list-container">

      {/* --- SEARCH BAR --- */}
      <div className="search-container" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search 'pizza', 'curry', 'Dishoom', 'vegan'..." 
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="search-input"
              autoComplete="off"
            />
            {searchQuery && (
              <button type="button" className="clear-btn" onClick={handleClear}>✕</button>
            )}
          </div>
          <button type="submit" className="search-btn">Search</button>

          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((place, index) => (
                <div
                  key={index}
                  className={`suggestion-item ${place._isCuisineSearch ? 'suggestion-cuisine' : ''}`}
                  onMouseDown={() => handleSuggestionClick(place)}
                >
                  <span className="suggestion-icon">{place._isCuisineSearch ? '🔎' : '🍽️'}</span>
                  <div className="suggestion-text">
                    <span className="suggestion-name">{place.displayName?.text}</span>
                    <span className="suggestion-address">{place.formattedAddress}</span>
                  </div>
                  {place.rating && <span className="suggestion-rating">⭐ {place.rating}</span>}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* --- FILTER TABS + QUICK FILTERS --- */}
      <div className="filter-section">
        <div className="filter-row">
          {['Restaurant', 'Cafe', 'Bar', 'Breakfast'].map((type) => (
            <button 
              key={type}
              onClick={() => handleFilterClick(type.toLowerCase())}
              className={`filter-btn ${activeFilter === type.toLowerCase() && !isSearching ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Quick filters row */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
        {/* Open Now toggle */}
        <button
          onClick={() => setOpenNowOnly(o => !o)}
          style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold',
            border: `2px solid ${openNowOnly ? '#16a34a' : '#e0e0e0'}`,
            background: openNowOnly ? '#dcfce7' : 'white',
            color: openNowOnly ? '#16a34a' : '#888',
            cursor: 'pointer', fontFamily: 'Arial, Helvetica, sans-serif',
            transition: 'all 0.15s', width: 'auto'
          }}
        >
          {openNowOnly ? '● Open Now' : '○ Open Now'}
        </button>

        {/* Price filters */}
        {[
          { label: '£', value: 'PRICE_LEVEL_INEXPENSIVE' },
          { label: '££', value: 'PRICE_LEVEL_MODERATE' },
          { label: '£££', value: 'PRICE_LEVEL_EXPENSIVE' },
          { label: '££££', value: 'PRICE_LEVEL_VERY_EXPENSIVE' },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setPriceFilter(p => p === value ? null : value)}
            style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold',
              border: `2px solid ${priceFilter === value ? '#162167' : '#e0e0e0'}`,
              background: priceFilter === value ? '#162167' : 'white',
              color: priceFilter === value ? 'white' : '#888',
              cursor: 'pointer', fontFamily: 'Arial, Helvetica, sans-serif',
              transition: 'all 0.15s', width: 'auto'
            }}
          >
            {label}
          </button>
        ))}

        {/* Clear filters */}
        {(openNowOnly || priceFilter) && (
          <button
            onClick={() => { setOpenNowOnly(false); setPriceFilter(null); }}
            style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '13px',
              border: '2px solid #e0e0e0', background: 'white', color: '#aaa',
              cursor: 'pointer', fontFamily: 'Arial, Helvetica, sans-serif'
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* --- CONTENT --- */}
      {loading ? (
        <p className="loading-text">Finding spots nearby... 📍</p>
      ) : (
        <>
          {isSearching ? (
            <CategoryRow title={`Search Results for "${searchQuery}"`} data={restaurants} />
          ) : (
            <>
              
              {recentViewName && recommendedPlaces.length > 0 && (
                <CategoryRow title={`✨ Because you viewed ${recentViewName}...`} data={recommendedPlaces.slice(0, 10)} />
              )}

              
              {pickedForYou.length > 0 && (
                <CategoryRow title={pickedLabel} data={pickedForYou} />
              )}

              
              {friendsReviewedPlaces.length > 0 && (
                <CategoryRow
                  title="⭐ Places your friends reviewed"
                  data={allLoadedPlaces.filter(p => friendsReviewedPlaces.includes(p.displayName?.text)).slice(0, 10)}
                />
              )}

              
              {friendsVisitedPlaces.length > 0 && (
                <CategoryRow
                  title="📍 Places your friends visited"
                  data={allLoadedPlaces.filter(p => friendsVisitedPlaces.includes(p.displayName?.text)).slice(0, 10)}
                />
              )}

              <CategoryRow title={`🔥 Most Popular ${activeFilter}s`} data={popularPlaces} />
              <CategoryRow title={`⭐ Top Rated ${activeFilter}s`} data={topRatedPlaces} />
              <CategoryRow title={`💎 Hidden Gems`} data={hiddenGems} />
              <CategoryRow title={`💰 Budget Friendly`} data={budgetFriendly} />
              <CategoryRow title={`🍽️ Fine Dining`} data={fineDining} />
              <CategoryRow title={`📍 Local ${activeFilter}s Near You`} data={localPlaces} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantList;