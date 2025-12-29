import { useEffect, useState } from 'react';
import { fetchRestaurants } from '../my-react-app/restaurantService';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchRestaurants();
      setRestaurants(data);
    };

    loadData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Nearby Restaurants</h2>
      
      {/* This loops through the list and makes a box for each restaurant */}
      {restaurants.map((place, index) => (
        <div key={index} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '10px',
            backgroundColor: 'white'
        }}>
          {/* We use specific codes to get the text safely */}
          <h3 style={{ margin: '0 0 10px 0' }}>{place.displayName?.text}</h3>
          <p><strong>Rating:</strong> {place.rating} ⭐</p>
          <p><strong>Address:</strong> {place.formattedAddress}</p>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
  