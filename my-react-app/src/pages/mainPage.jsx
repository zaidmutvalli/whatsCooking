
import React from 'react';
import "../styles/mainPage.css";
import NavBar from '../Components/navigation-bar';
import Filters from '../Components/filters';
import RestaurantList from "../Components/restrauntList"



const restaurants = [//restaurants array for testing purposes
    { name: "Restaurant 1", image: "https://via.placeholder.com/150", rating: "★ ★ ★ ★ ☆" },
    { name: "Restaurant 2", image: "https://via.placeholder.com/150", rating: "★ ★ ★ ☆ ☆" },
    { name: "Restaurant 3", image: "https://via.placeholder.com/150", rating: "★ ★ ★ ★ ★" },
    { name: "Restaurant 4", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
    { name: "Restaurant 5", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
    { name: "Restaurant 6", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
    { name: "Restaurant 7", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
    { name: "Restaurant 8", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
    { name: "Restaurant 9", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
    
  ]


  const cafes = [
  { name: "Cafe 1", image: "https://via.placeholder.com/150", rating: "★ ★ ★ ☆ ☆" },
  { name: "Cafe 2", image: "https://via.placeholder.com/150", rating: "★ ★ ★ ★ ☆" },
  { name: "Cafe 3", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
  { name: "Cafe 4", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
  { name: "Cafe 5", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
  { name: "Cafe 6", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
  { name: "Cafe 7", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
  { name: "Cafe 8", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
  { name: "Cafe 9", image: "https://via.placeholder.com/150", rating: "★ ★ ☆ ☆ ☆" },
  ]






export default function MainPage() {
    return (
        <div>
      <NavBar />
      <Filters/>
      <h2>Trending Restaurants </h2> 
      <section className='restaurant-list'> 
        
       
        {restaurants.map((r, i) => ( //this maps any test restaurants in array to the RestaurantList
        <RestaurantList
        key = {i}
        name = {r.name}
        image = {r.image}
        rating ={r.rating}
        />
        ))}
    
    </section>
    <h2>Trending Cafes</h2>
    <section className='restaurant-list'>
        {cafes.map((c, i) => (
          <RestaurantList
          key = {i}
          name = {c.name}
          image={c.image}
          rating={c.rating}
          />
        ))}
    </section>
    </div>        
    );
    }