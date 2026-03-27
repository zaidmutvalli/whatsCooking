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

    if (loading) return (
        <div>
            {[1, 2].map(i => (
                <div key={i} style={{ borderBottom: '1px solid #f5f5f5', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ background: '#e8e8e8', borderRadius: '6px', width: '90px', height: '13px' }} />
                        <div style={{ background: '#e8e8e8', borderRadius: '6px', width: '70px', height: '13px' }} />
                    </div>
                    <div style={{ background: '#f0f0f0', borderRadius: '6px', width: '50%', height: '13px', marginBottom: '6px' }} />
                    <div style={{ background: '#f0f0f0', borderRadius: '6px', width: '100%', height: '11px', marginBottom: '4px' }} />
                    <div style={{ background: '#f0f0f0', borderRadius: '6px', width: '75%', height: '11px' }} />
                </div>
            ))}
        </div>
    );

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
