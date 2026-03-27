import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user-settings.css";

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/[\s_]+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name[0].toUpperCase();
}

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

function StarDisplay({ rating }) {
    return (
        <span className="review-stars">
            {"★".repeat(rating)}{"☆".repeat(5 - rating)}
        </span>
    );
}

export default function UserSettings() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [editingName, setEditingName] = useState(false);
    const [nameInput, setNameInput] = useState("");

    const [avatar, setAvatar] = useState(null);

    const [aboutMe, setAboutMe] = useState("");
    const [editingAbout, setEditingAbout] = useState(false);
    const [aboutInput, setAboutInput] = useState("");

    const [reviews, setReviews] = useState([]);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [signOutConfirm, setSignOutConfirm] = useState(false);
    const [loadingReviewId, setLoadingReviewId] = useState(null);

    const [followStats, setFollowStats] = useState({ following_count: 0, followers_count: 0, following: [], followers: [] });
    const [modal, setModal] = useState(null); // 'following' | 'followers' | null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch real username from session
        fetch("http://localhost:8888/get_user_info.php", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    const username = data.user.username;
                    setName(username);
                    setNameInput(username);
                    localStorage.setItem("username", username);
                }
                setLoading(false);
            })
            .catch(() => {
                const saved = localStorage.getItem("username");
                if (saved) { setName(saved); setNameInput(saved); }
                setLoading(false);
            });

        const savedAvatar = localStorage.getItem("avatar");
        if (savedAvatar) setAvatar(savedAvatar);

        const savedAbout = localStorage.getItem("aboutMe");
        if (savedAbout) setAboutMe(savedAbout);

        fetch("http://localhost:8888/get_user_reviews.php", { credentials: "include" })
            .then(res => res.json())
            .then(data => { if (data.status === "success") setReviews(data.reviews); })
            .catch(() => {});

        fetch("http://localhost:8888/get_follow_stats.php", { credentials: "include" })
            .then(res => res.json())
            .then(data => { if (data.status === "success") setFollowStats(data); })
            .catch(() => {});
    }, []);

    const saveName = async () => {
        if (!nameInput.trim()) return;
        try {
            const res = await fetch("http://localhost:8888/update_username.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username: nameInput.trim() })
            });
            const data = await res.json();
            if (data.status !== "success") return;
        } catch {}
        setName(nameInput);
        localStorage.setItem("username", nameInput);
        window.dispatchEvent(new Event("storage"));
        setEditingName(false);
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result);
            localStorage.setItem("avatar", reader.result);
        };
        reader.readAsDataURL(file);
    };

    const saveAbout = () => {
        setAboutMe(aboutInput);
        localStorage.setItem("aboutMe", aboutInput);
        setEditingAbout(false);
    };

    const deleteReview = async (reviewId) => {
        try {
            const res = await fetch("http://localhost:8888/delete_review.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ reviewId })
            });
            const data = await res.json();
            if (data.status === "success") {
                setReviews(prev => prev.filter(r => r.id !== reviewId));
            }
        } catch {}
        setDeleteConfirmId(null);
    };

    const navigateToRestaurant = async (review) => {
        if (deleteConfirmId === review.id) return;
        setLoadingReviewId(review.id);
        const place = await lookupPlace(review.restaurant_name);
        setLoadingReviewId(null);
        navigate("/about", { state: { place: place ?? { displayName: { text: review.restaurant_name } } } });
    };

    const signOut = async () => {
        try {
            await fetch("http://localhost:8888/logout.php", {
                method: "POST",
                credentials: "include"
            });
        } catch {}
        localStorage.removeItem("username");
        localStorage.removeItem("avatar");
        localStorage.removeItem("aboutMe");
        navigate("/logIn");
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
                    <div className="section-card">
                        <div style={{ ...skel, width: '70px', height: '16px', marginBottom: '12px' }} />
                        <div style={{ ...skelLight, width: '100%', height: '12px', marginBottom: '6px' }} />
                        <div style={{ ...skelLight, width: '80%', height: '12px' }} />
                    </div>
                </div>
                <div className="profile-right">
                    <div className="section-card">
                        <div className="section-header">
                            <div style={{ ...skel, width: '100px', height: '18px' }} />
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

    return (
        <div className="profile-page">

            {/* Follow modal */}
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{modal === "followers" ? "Followers" : "Following"}</h3>
                            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
                        </div>
                        <ul className="modal-list">
                            {(modal === "followers" ? followStats.followers : followStats.following).length === 0 ? (
                                <li className="modal-empty">No {modal} yet.</li>
                            ) : (
                                (modal === "followers" ? followStats.followers : followStats.following).map(u => (
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

                {/* Left panel */}
                <div className="profile-left">
                    <div className="profile-card">
                        <div className="avatar-section">
                            <div className="avatar-circle">
                                {avatar
                                    ? <img src={avatar} alt="Profile" />
                                    : getInitials(name)
                                }
                            </div>
                            <label className="avatar-upload-label">
                                Change photo
                                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
                            </label>

                            {editingName ? (
                                <div style={{ textAlign: "center", width: "100%" }}>
                                    <input
                                        className="edit-input"
                                        value={nameInput}
                                        onChange={e => setNameInput(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="edit-actions">
                                        <button className="save-btn" onClick={saveName}>Save</button>
                                        <button className="cancel-btn" onClick={() => { setEditingName(false); setNameInput(name); }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="username-row">
                                    <span className="username-display">{name || "..."}</span>
                                    <button className="edit-btn" onClick={() => setEditingName(true)}>Edit</button>
                                </div>
                            )}
                        </div>

                        {/* Follow stats */}
                        <div className="follow-stats">
                            <button className="follow-stat-btn" onClick={() => setModal("following")}>
                                <span className="follow-count">{followStats.following_count}</span>
                                <span className="follow-label">Following</span>
                            </button>
                            <div className="follow-divider" />
                            <button className="follow-stat-btn" onClick={() => setModal("followers")}>
                                <span className="follow-count">{followStats.followers_count}</span>
                                <span className="follow-label">Followers</span>
                            </button>
                        </div>
                    </div>

                    {/* About Me */}
                    <div className="section-card">
                        <div className="section-header">
                            <h3 className="section-title">About me</h3>
                            {!editingAbout && (
                                <button className="edit-btn" onClick={() => { setAboutInput(aboutMe); setEditingAbout(true); }}>Edit</button>
                            )}
                        </div>
                        {editingAbout ? (
                            <>
                                <textarea
                                    className="about-textarea"
                                    value={aboutInput}
                                    onChange={e => setAboutInput(e.target.value)}
                                    placeholder="Tell people about yourself..."
                                    autoFocus
                                />
                                <div className="edit-actions">
                                    <button className="save-btn" onClick={saveAbout}>Save</button>
                                    <button className="cancel-btn" onClick={() => setEditingAbout(false)}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            aboutMe
                                ? <p className="about-text">{aboutMe}</p>
                                : <p className="about-placeholder">Tell people about yourself...</p>
                        )}
                    </div>

                    {/* Sign out */}
                    {signOutConfirm ? (
                        <div className="confirm-box">
                            <p className="confirm-text">Are you sure you want to sign out?</p>
                            <div className="edit-actions">
                                <button className="signout-btn-confirm" onClick={signOut}>Yes, sign out</button>
                                <button className="cancel-btn" onClick={() => setSignOutConfirm(false)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button className="signout-btn" onClick={() => setSignOutConfirm(true)}>Sign Out</button>
                    )}
                </div>

                {/* Right panel — Reviews */}
                <div className="profile-right">
                    <div className="section-card">
                        <div className="section-header">
                            <h3 className="section-title">My Reviews</h3>
                            <span className="review-count">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                        </div>
                        {reviews.length === 0 ? (
                            <p className="no-reviews">You haven't reviewed anything yet.</p>
                        ) : (
                            reviews.map(review => (
                                <div
                                    key={review.id}
                                    className="review-card review-card-clickable"
                                    onClick={() => navigateToRestaurant(review)}
                                >
                                    <div className="review-card-header">
                                        <div>
                                            <div className="review-restaurant">{review.restaurant_name}</div>
                                            <StarDisplay rating={review.rating} />
                                        </div>
                                        {deleteConfirmId === review.id ? (
                                            <div className="delete-confirm" onClick={e => e.stopPropagation()}>
                                                <span className="confirm-inline-text">Delete this review?</span>
                                                <button className="confirm-yes-btn" onClick={() => deleteReview(review.id)}>Yes</button>
                                                <button className="confirm-no-btn" onClick={() => setDeleteConfirmId(null)}>No</button>
                                            </div>
                                        ) : (
                                            <button className="delete-btn" onClick={e => { e.stopPropagation(); setDeleteConfirmId(review.id); }}>Delete</button>
                                        )}
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

