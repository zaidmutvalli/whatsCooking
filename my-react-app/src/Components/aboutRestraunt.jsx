import "../styles/aboutRestrauntCard.css"
import sampleImage from "../assets/sampleResImage.jpeg"



export default function aboutRestrauntCard({resName, resImage, resDesc}){

    return(
        <div className="aboutRestrauntCard">
            <img src={resImage} alt={resName} className="resImage"/>
            <div className="textContent">
            <h2 className="resName">{resName}</h2>
            <p className="resDesc">{resDesc}</p>
            </div>
        </div>
    )
}


export  function Location({locAddressLine}){

    return(
        <div className="locationCard">
            <div className="textContentLocation">
            <h2 className="locTitle">Location</h2>
            <p className="locAddressLine1">{locAddressLine}</p>

            </div>
        </div>
    )
}