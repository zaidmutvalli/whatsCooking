import "../styles/reviewPage.css"
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function RightSide({ resName, place }){

  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const navigate = useNavigate();

    useEffect(()=>{

        fetch("http://localhost:8888/get_user_info.php",{
            credentials:'include'
        })

        .then(res => res.json())
        .then(data => {
            if (data.status === "success"){
                setUser(data.user)
            }
            setLoading(false);
        })
        .catch(()=> setLoading(false));

    },[]);


    const [rating, setRating] = useState(0);
    const [title,setTitle] = useState('')
    const [reviewText,setReviewText] = useState('')

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (rating===0){
        alert("Please select a rating")
        return;
      }

      const formData = {
        rating:rating,
        title: title,
        reviewText: reviewText,
        restaurantName: resName,
        userId: user.id
      };










      try {
          const response = await fetch("http://localhost:8888/addReview.php", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
          });

          const result = await response.json();

          if (result.status === "success") {
              alert("Review submitted succesfully");
              navigate('/about', { state: { place } })
             
          } else {
              alert(result.message); // Show server-provided error message
          }
      } catch (error) {
          console.error("Error:", error);
          alert("An error occurred. Please Try again.");
      }
  };

    if (loading) return null;

    if (!user) return (
        <div className="notLoggedIn">
            <p className="Question">You must be logged in to leave a review.</p>
            <button className="ReviewSubmitButton" onClick={() => navigate('/logIn')}>Log In</button>
        </div>
    );

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

   <form className="reviewForm" onSubmit={handleSubmit}>
    <p className="Question" >Title of your Review </p>
    <input required maxLength={100} className="TitleInput" value={title} onChange={(e) => setTitle(e.target.value)}></input>
    <p className="Question" >What do you want to say?</p>
    <textarea required className="TextInput" value={reviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>
    <button className="ReviewSubmitButton">Submit</button>
    </form>
   

    
    
    
    
    
    
    
    </>


}