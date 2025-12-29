import React from "react";
import {APIProvider, Map ,} from '@vis.gl/react-google-maps';





export default function DisplayMap({lat, lng}) {
  const myAPIkey = import.meta.env.VITE_REACT_APP_API_KEY

    
    return (
      <APIProvider apiKey={myAPIkey} onLoad={()=>console.log("Google Maps API loaded")}>
        <Map
      defaultZoom={13}
      defaultCenter={ { lat: 53.478559, lng: -2.242610 } }
      disableDefaultUI={true}
      
      >
   </Map>
        
        

      </APIProvider>



        

    );
};