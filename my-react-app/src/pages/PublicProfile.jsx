import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/user-settings.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

async function lookupPlace(restaurantName) {
    try {
        const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": API_KEY,
                "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.photos,places.location,places.userRatingCount,places.editorialSummary,places.currentOpeningHours,places.nationalPhoneNumber,places.websiteUri"
            },
            body: JSON.stringify({ textQuery: restaurantName })
        });
        const data = await res.json();
        return data.places?.[0] ?? null;
    } catch {
        return null;
    }
}

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/[\s_]+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name[0].toUpperCase();
}

function StarDisplay({ rating }) {
    return (
        <span className="review-stars">
            {"★".repeat(rating)}{"☆".repeat(5 - rating)}
        </span>
    );
}

export default function PublicProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [loadingReviewId, setLoadingReviewId] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8888/get_public_profile.php?userId=${userId}`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") setProfile(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [userId]);

    const navigateToRestaurant = async (review) => {
        setLoadingReviewId(review.id);
        const place = await lookupPlace(review.restaurant_name);
        setLoadingReviewId(null);
        navigate("/about", { state: { place: place ?? { displayName: { text: review.restaurant_name } } } });
    };

    const skel = { background: '#e8e8e8', borderRadius: '6px' };
    const skelLight = { background: '#f0f0f0', borderRadius: '6px' };

    if (loading) return (
        <div className="profile-page">
            <div className="profile-layout">
                <div className="profile-left">
                    <div className="profile-card">
                        <div className="avatar-section">
                            <div className="avatar-circle" style={{ background: '#e8e8e8', color: 'transparent' }}>?</div>
                            <div style={{ ...skel, width: '120px', height: '16px', margin: '10px auto 6px' }} />
                            <div className="follow-stats">
                                <div style={{ textAlign: 'center', padding: '8px 16px' }}>
                                    <div style={{ ...skel, width: '30px', height: '18px', margin: '0 auto 4px' }} />
                                    <div style={{ ...skelLight, width: '55px', height: '12px', margin: '0 auto' }} />
                                </div>
                                <div className="follow-divider" />
                                <div style={{ textAlign: 'center', padding: '8px 16px' }}>
                                    <div style={{ ...skel, width: '30px', height: '18px', margin: '0 auto 4px' }} />
                                    <div style={{ ...skelLight, width: '55px', height: '12px', margin: '0 auto' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-right">
                    <div className="section-card">
                        <div className="section-header">
                            <div style={{ ...skel, width: '80px', height: '18px' }} />
                            <div style={{ ...skelLight, width: '60px', height: '14px' }} />
                        </div>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="review-card" style={{ marginBottom: '12px' }}>
                                <div style={{ ...skel, width: '55%', height: '15px', marginBottom: '8px' }} />
                                <div style={{ ...skelLight, width: '80px', height: '13px', marginBottom: '8px' }} />
                                <div style={{ ...skelLight, width: '100%', height: '12px', marginBottom: '5px' }} />
                                <div style={{ ...skelLight, width: '70%', height: '12px' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
    if (!profile) return <div className="profile-page"><p style={{ padding: 40 }}>User not found.</p></div>;

    return (
        <div className="profile-page">

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{modal === "followers" ? "Followers" : "Following"}</h3>
                            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <ul className="modal-list">
                            {(modal === "followers" ? profile.followers : profile.following).length === 0 ? (
                                <li className="modal-empty">No {modal} yet.</li>
                            ) : (
                                (modal === "followers" ? profile.followers : profile.following).map(u => (
                                    <li
                                        key={u.id}
                                        className="modal-user modal-user-link"
                                        onClick={() => { setModal(null); navigate(`/profile/${u.id}`); }}
                                    >
                                        {u.username}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            )}

            <div className="profile-layout">
                <div className="profile-left">
                    <div className="profile-card">
                        <div className="avatar-section">
                            <div className="avatar-circle">
                                {getInitials(profile.user.username)}
                            </div>
                            <div className="username-row">
                                <span className="username-display">{profile.user.username}</span>
                            </div>
                            <div className="follow-stats">
                                <button className="follow-stat-btn" onClick={() => setModal("following")}>
                                    <span className="follow-count">{profile.following_count}</span>
                                    <span className="follow-label">Following</span>
                                </button>
                                <div className="follow-divider" />
                                <button className="follow-stat-btn" onClick={() => setModal("followers")}>
                                    <span className="follow-count">{profile.followers_count}</span>
                                    <span className="follow-label">Followers</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-right">
                    <div className="section-card">
                        <div className="section-header">
                            <h3 className="section-title">Reviews</h3>
                            <span className="review-count">{profile.reviews.length} review{profile.reviews.length !== 1 ? "s" : ""}</span>
                        </div>
                        {profile.reviews.length === 0 ? (
                            <p className="no-reviews">No reviews yet.</p>
                        ) : (
                            profile.reviews.map(review => (
                                <div key={review.id} className="review-card review-card-clickable" onClick={() => navigateToRestaurant(review)}>
                                    <div className="review-card-header">
                                        <div>
                                            <div className="review-restaurant">{review.restaurant_name}</div>
                                            <StarDisplay rating={review.rating} />
                                        </div>
                                    </div>
                                    <p className="review-title">{review.title}</p>
                                    <p className="review-text">{review.review_text}</p>
                                    <p className="review-date">{new Date(review.created_at).toLocaleDateString()}</p>
                                    {loadingReviewId === review.id && <p className="review-loading">Loading...</p>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
