import { useState, useEffect } from "react";
import "../styles/aboutRestrauntCard.css";

export default function DisplayReviews({ resName }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!resName) return;

        fetch(`http://localhost:8888/getReviews.php?restaurantName=${encodeURIComponent(resName)}`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    setReviews(data.reviews);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [resName]);

    if (loading) return null;

    if (reviews.length === 0) return <p className="resDesc">No reviews yet. Be the first to leave one!</p>;

    return (
        <div className="reviewsList">
            {reviews.map((review) => (
                <div key={review.id} className="reviewCard">
                    <div className="reviewHeader">
                        <span className="reviewUsername">{review.username}</span>
                        <span className="reviewRating">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                    </div>
                    <p className="reviewTitle">{review.title}</p>
                    <p className="reviewText">{review.review_text}</p>
                </div>
            ))}
        </div>
    );
}
