
import { useEffect, useState } from 'react';
import { fetchRestaurants } from '../restaurantService';

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
      {restaurants.length === 0 ? (
        <p>Loading...</p>
      ) : (
        restaurants.map((place, index) => (
          <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{place.displayName?.text}</h3>
            <p>Rating: {place.rating} ⭐</p>
            <p>{place.formattedAddress}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default RestaurantList;