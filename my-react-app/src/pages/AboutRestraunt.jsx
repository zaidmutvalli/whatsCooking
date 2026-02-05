import React, { useLayoutEffect } from 'react';
import AboutRestaurantCard, {Location} from '../Components/aboutRestraunt';
import DisplayMap from "../Components/map"


import "../styles/map.css";
import "../styles/aboutRestrauntCard.css";
import { useLocation } from 'react-router-dom';



const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;








export default function AboutRestaurant() {
  const {state}= useLocation();
  const place=state?.place;

  console.log(place);

  const getPhotoUrl = (place) => {
    if (place.photos && place.photos.length > 0) {
        const photoRef = place.photos[0].name;
        return `https://places.googleapis.com/v1/${photoRef}/media?key=${apiKey}&maxHeightPx=400&maxWidthPx=400`;
    }
    // Fallback image if no photo exists
    return "https://via.placeholder.com/300x400?text=No+Image";
  };


  
  return (
    <>
    <div className='main'>
    <div className='leftContent'>

      <AboutRestaurantCard 
  
      resName={place?.displayName?.text || "Unknown Name"}
      resDesc={place?.editorialSummary?.text || "No description available."}
      resImage = {getPhotoUrl(place)}

    />

   

    </div>

    <div className='rightContent'>

      <div className='mapSection'>
      <DisplayMap
          lat={place?.location?.latitude ?? 0}
          lng={place?.location?.longitude ?? 0}

      
      />
      </div>
      <Location
       locAddressLine={place?.formattedAddress} />
    </div>

    </div>



    
    </>
    
    
  
  );

}
