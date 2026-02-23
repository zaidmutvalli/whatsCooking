import "../styles/reviewPage.css"
import sampleResImage from "../assets/sampleResImage.jpeg";



export default function ReviewLeftSide({resName,resImage}){
    return(<>
    
    <p className="largeText">How was your visit at {resName}</p>
    <img src={resImage} className="resImage largeResImage"/>
    <></>
    
    
    
    
    </>)


}