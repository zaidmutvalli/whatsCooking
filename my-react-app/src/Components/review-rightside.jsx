import "../styles/reviewPage.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RightSide({ resName, place }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8888/get_user_info.php", { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { alert("Please select a star rating"); return; }
    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:8888/addReview.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title, reviewText, restaurantName: resName, userId: user.id }),
      });
      const result = await response.json();
      if (result.status === "success") {
        alert("Review submitted successfully!");
        navigate('/about', { state: { place } });
      } else {
        alert(result.message);
      }
    } catch {
      alert("An error occurred. Please try again.");
    }
    setSubmitting(false);
  };

  const starLabels = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

  if (loading) return null;

  if (!user) return (
    <div className="notLoggedIn">
      <p className="Question">You must be logged in to leave a review.</p>
      <button className="ReviewSubmitButton" onClick={() => navigate('/logIn')}>Log In</button>
    </div>
  );

  return (
    <>
      <p className="Question">How would you rate your experience?</p>

      {/* STAR RATING */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              style={{
                fontSize: '40px',
                cursor: 'pointer',
                color: star <= (hovered || rating) ? '#f59e0b' : '#ddd',
                transition: 'color 0.1s, transform 0.1s',
                transform: star <= (hovered || rating) ? 'scale(1.15)' : 'scale(1)',
                display: 'inline-block',
                lineHeight: 1,
              }}
            >
              ★
            </span>
          ))}
        </div>
        {/* Label below stars */}
        {(hovered || rating) > 0 && (
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f59e0b' }}>
            {starLabels[hovered || rating]}
          </span>
        )}
      </div>

      <form className="reviewForm" onSubmit={handleSubmit}>
        <p className="Question">Title of your review</p>
        <input
          required
          maxLength={100}
          className="TitleInput"
          value={title}
          placeholder="Summarise your experience..."
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="Question">What do you want to say?</p>
        <textarea
          required
          className="TextInput"
          value={reviewText}
          placeholder="Tell others what you thought about the food, service, atmosphere..."
          onChange={(e) => setReviewText(e.target.value)}
        />
        <button className="ReviewSubmitButton" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </>
  );
}