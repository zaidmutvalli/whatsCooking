import React from 'react';
import AboutRestaurantCard, {Location} from '../Components/aboutRestraunt';
import DisplayMap from "../Components/map"

import "../styles/map.css";
import "../styles/aboutRestrauntCard.css";

export default function AboutRestaurant() {
  
  return (
    <>
    <div className='main'>
    <div className='leftContent'>

      <AboutRestaurantCard 
  
      resName={"La creme coffee"}
      resDesc={"Delicious Bites offers a fusion of global flavors with a cozy ambiance. Our menu features a variety of dishes crafted from fresh, locally sourced ingredients. Whether you're craving a hearty meal or a light snack, we have something to satisfy every palate. Join us for an unforgettable dining experience!"}
      resImage={"sampleImage"}
    />

   

    </div>

    <div className='rightContent'>

      <div className='mapSection'>
      <DisplayMap
       lat={51.2} lng={0.4}
      />
      </div>
      <Location
       locPostCode={"m1 4nj"}
       locAddressLine1={"123 Flavor St."} />

    
    
    </div>

    </div>



    
    </>
    
    
  
  );

}
