import React from 'react';
import RestaurantList from '../Components/restrauntList';

const MainPage = () => {
  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 0 20px' }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '1.8rem', color: '#1a1a1a', fontFamily: 'Arial, Helvetica, sans-serif' }}>
          Nearby Restaurants
        </h1>
        <RestaurantList />
      </div>
    </div>
  );
};

export default MainPage;