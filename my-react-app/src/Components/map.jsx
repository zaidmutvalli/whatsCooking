import React from "react";
import {APIProvider, Map ,} from '@vis.gl/react-google-maps';


export default function DisplayMap({lat, lng}) {
  

    
    return (
      <APIProvider apiKey={"AIzaSyD473z58BvgbrNHJUnaSkR07KFHbNT0CJU"} onLoad={()=>console.log("Google Maps API loaded")}>
        <Map
      defaultZoom={13}
      defaultCenter={ { lat: 53.478559, lng: -2.242610 } }
      disableDefaultUI={true}
      
      >
   </Map>
        
        

      </APIProvider>



        

    );
};