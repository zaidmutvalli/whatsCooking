import React from 'react';
import NavigationBar from '../Components/navigation-bar';

import RestaurantList from '../Components/restrauntList'; 

const MainPage = () => {
  return (
    <div className="main-page">
      <NavigationBar />
      
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Nearby Restaurants</h1>
        
        {/* This replaces the old "Restaurant 1, Restaurant 2" hardcoded cards */}
        <RestaurantList />
      </div>
    </div>
  );
};

export default MainPage;