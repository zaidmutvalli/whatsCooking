import "../styles/reviewPage.css"
import { useState } from "react";


export default function RightSide(){
    const [rating, setRating] = useState(0);

    return <>
 

    <p className="Question">How would you rate your expierence?</p>
    <div className="rating">
  {[1, 2, 3, 4, 5].map((value) => (
    <label className="radioChoice" key={value}>
      <input
        type="radio"
        name="rating"
        value={value}
        checked={rating === value}
        onChange={() => setRating(value)}
      />
      <span
        className="customRadio"
        data-active={value <= rating}
      ></span>
    </label>
  ))}
</div>

   <form>
    <p className="Question" >Title of your Review </p>
    <input required maxLength={100} className="TitleInput"></input>
    <p className="Question" >What do you want to say?</p>
    <textarea required className="TextInput" ></textarea>
    <button className="ReviewSubmitButton">Submit</button>
    </form>
   

    
    
    
    
    
    
    
    </>


}