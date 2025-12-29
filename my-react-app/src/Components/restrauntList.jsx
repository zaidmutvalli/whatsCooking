import { useEffect, useState } from 'react';
import { fetchRestaurants } from '../restaurantService';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [activeFilter, setActiveFilter] = useState('restaurant');
  const [loading, setLoading] = useState(false);
  
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>

      <div style={styles.filterSection}>
        <div style={styles.filterRow}>
          {['Restaurant', 'Cafe', 'Bar', 'Breakfast'].map((type) => (
            <button 
              key={type}
              onClick={() => handleFilterClick(type.toLowerCase())}
              style={{
                ...styles.filterButton,
                color: activeFilter === type.toLowerCase() ? '#0e103c' : '#888',
                fontWeight: activeFilter === type.toLowerCase() ? 'bold' : 'normal',
                borderBottom: activeFilter === type.toLowerCase() ? '2px solid #0e103c' : 'none'
              }}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading places...</p>
      ) : (
        <div style={styles.gridContainer}>
          {restaurants.map((place, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.imageContainer}>
                  <img 
                    src={getPhotoUrl(place)} 
                    alt={place.displayName?.text} 
                    style={styles.image}
                    onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/300x400"}}
                  />
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.placeName}>{place.displayName?.text}</h3>
                <div style={styles.statsRow}>
                  <span style={styles.statItem}>⭐ {place.rating}</span>
                  <span style={{...styles.statItem, color: '#27ae60'}}>{formatPrice(place.priceLevel)}</span>
                </div>
                <p style={{fontSize: '12px', color: '#777', margin: '5px 0 0 0'}}>{place.formattedAddress}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '25px',
    padding: '20px 0',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s',
  },
  imageContainer: { width: '100%', height: '180px', backgroundColor: '#f0f0f0' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  cardContent: { padding: '15px' },
  placeName: { fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 8px 0', color: '#333' },
  statsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statItem: { fontWeight: 'bold' },
  
  filterSection: { marginBottom: '30px' },
  filterRow: { display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '5px' },
  filterButton: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '5px 0' },
};

export default RestaurantList;