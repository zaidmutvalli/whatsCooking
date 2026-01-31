import React from "react";
import {APIProvider, AdvancedMarker, Map ,} from '@vis.gl/react-google-maps';





export default function DisplayMap({lat, lng}) {
    const myAPIkey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
    const mapID= import.meta.env.VITE_GOOGLE_MAP_ID || import.meta.env.VITE_GOOGLE_MAP_ID;
   
    
      
      
    
    return (
      <APIProvider apiKey={myAPIkey} onLoad={()=>console.log("Google Maps API loaded")}>
        <Map
      defaultZoom={13}
      defaultCenter={ { lat: 53.478559, lng: -2.242610 } }
      disableDefaultUI={true}
      mapId={mapID}
      
      >
      <AdvancedMarker position={{lat: 53.478559, lng: -2.242610}} />


   </Map>
        
        

      </APIProvider>



        

    );
};