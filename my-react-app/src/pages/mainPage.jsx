import React from 'react';
import NavigationBar from '../Components/navigation-bar';
import RestaurantList from '../Components/restrauntList';

// Debug log to verify the Google Maps API key is loaded from the environment
console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

// Main landing page — displays the navigation bar and a list of nearby restaurants
const MainPage = () => {
  return (
    <div className="main-page">
      <NavigationBar />

      {/* Centred content area with max width for readability on large screens */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Nearby Restaurants</h1>

        <RestaurantList />
      </div>
    </div>
  );
};

export default MainPage;