import React from 'react';
import NavigationBar from '../Components/navigation-bar';
import RestaurantList from '../Components/restrauntList';

const MainPage = () => {
  return (
    <div>
      <NavigationBar />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Welcome to What's Cooking!</h1>
        <p>Here are some places to eat nearby:</p>
        
        {/* This places the list on the screen */}
        <RestaurantList />
      </div>
    </div>
  );
};

export default MainPage;