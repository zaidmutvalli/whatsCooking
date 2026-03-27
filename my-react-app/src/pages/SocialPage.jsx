import { useEffect, useState } from 'react';
import '../styles/reviewPage.css';

const userCache = {};

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

export default function SocialPage() {
    const [feed, setFeed] = useState({ reviews: [], visits: [] });
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('feed');
    const [loadingPlace, setLoadingPlace] = useState(null);
    const [pendingLikes, setPendingLikes] = useState(new Set());
    const [expandedComments, setExpandedComments] = useState({});
    const [comments, setComments] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        loadFeed();
        loadUsers('');
    }, []);

    const loadFeed = async () => {
        try {
            const res = await fetch('http://localhost:8888/get_social_feed.php', { credentials: 'include' });
            const data = await res.json();
            if (data.status === 'success' || data.status === 'no_friends') setFeed(data);
        } catch {}
        setLoading(false);
    };

    const loadUsers = async (q) => {
        if (userCache[q]) {
            setUsers(userCache[q]);
            return;
        }
        try {
            const res = await fetch(`http://localhost:8888/get_users.php?q=${q}`, { credentials: 'include' });
            const data = await res.json();
            if (data.status === 'success') {
                userCache[q] = data.users;
                setUsers(data.users);
            }
        } catch {}
    };

    const toggleFollow = async (userId) => {
        try {
            const res = await fetch('http://localhost:8888/toggle_follow.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ friend_id: userId })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setUsers(prev => prev.map(u =>
                    u.id === userId ? { ...u, is_following: data.action === 'followed' ? 1 : 0 } : u
                ));
                if (data.action === 'followed') loadFeed();
            }
        } catch {}
    };

    const handleRestaurantClick = async (restaurantName) => {
        setLoadingPlace(restaurantName);
        const place = await lookupPlace(restaurantName);
        setLoadingPlace(null);
        navigate('/about', { state: { place: place ?? { displayName: { text: restaurantName } } } });
    };

    const toggleLike = async (reviewId, type) => {
        if (pendingLikes.has(reviewId)) return;
        setPendingLikes(prev => new Set(prev).add(reviewId));
        // Optimistic update
        setFeed(prev => ({
            ...prev,
            reviews: prev.reviews.map(r => {
                if (r.review_id !== reviewId) return r;
                const alreadyVoted = r.user_vote === type;
                const switchingVote = r.user_vote && r.user_vote !== type;
                return {
                    ...r,
                    user_vote: alreadyVoted ? null : type,
                    like_count: type === 'like'
                        ? Number(r.like_count) + (alreadyVoted ? -1 : 1)
                        : Number(r.like_count) - (switchingVote && r.user_vote === 'like' ? 1 : 0),
                    dislike_count: type === 'dislike'
                        ? Number(r.dislike_count) + (alreadyVoted ? -1 : 1)
                        : Number(r.dislike_count) - (switchingVote && r.user_vote === 'dislike' ? 1 : 0),
                };
            })
        }));
        try {
            const res = await fetch('http://localhost:8888/toggle_like.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ reviewId, type })
            });
            const data = await res.json();
            // Reconcile with server counts
            if (data.status === 'success') {
                setFeed(prev => ({
                    ...prev,
                    reviews: prev.reviews.map(r =>
                        r.review_id === reviewId
                            ? { ...r, like_count: data.like_count, dislike_count: data.dislike_count, user_vote: data.user_vote }
                            : r
                    )
                }));
            }
        } catch {}
        setPendingLikes(prev => { const s = new Set(prev); s.delete(reviewId); return s; });
    };

    const toggleComments = async (reviewId) => {
        const isOpen = expandedComments[reviewId];
        setExpandedComments(prev => ({ ...prev, [reviewId]: !isOpen }));
        if (!isOpen && !comments[reviewId]) {
            try {
                const res = await fetch(`http://localhost:8888/get_comments.php?reviewId=${reviewId}`, { credentials: 'include' });
                const data = await res.json();
                if (data.status === 'success') setComments(prev => ({ ...prev, [reviewId]: data.comments }));
            } catch {}
        }
    };

    const postComment = async (reviewId) => {
        const text = (commentInputs[reviewId] || '').trim();
        if (!text) return;
        try {
            const res = await fetch('http://localhost:8888/add_comment.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ reviewId, comment: text })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setComments(prev => ({ ...prev, [reviewId]: [...(prev[reviewId] || []), data.comment] }));
                setCommentInputs(prev => ({ ...prev, [reviewId]: '' }));
                setFeed(prev => ({
                    ...prev,
                    reviews: prev.reviews.map(r =>
                        r.review_id === reviewId ? { ...r, comment_count: Number(r.comment_count) + 1 } : r
                    )
                }));
            }
        } catch {}
    };

    const timeAgo = (dateStr) => {
        const diff = (Date.now() - new Date(dateStr)) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const s = {
        page: { paddingTop: '68px', maxWidth: '800px', margin: '0 auto', padding: '80px 24px 40px', fontFamily: 'Arial, Helvetica, sans-serif' },
        heading: { margin: '0 0 4px 0', fontSize: '1.6rem', fontWeight: 'bold' },
        subtext: { color: '#888', marginBottom: '24px', fontSize: '14px' },
        tabs: { display: 'flex', borderBottom: '2px solid #f0f0f0', marginBottom: '24px' },
        tab: (a) => ({ background: 'none', border: 'none', borderBottom: a ? '3px solid #162167' : '3px solid transparent', padding: '10px 20px', fontWeight: a ? 'bold' : 'normal', color: a ? '#162167' : '#aaa', cursor: 'pointer', fontSize: '15px', marginBottom: '-2px', fontFamily: 'Arial, Helvetica, sans-serif' }),
        card: { background: 'white', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
        avatar: { width: '38px', height: '38px', borderRadius: '50%', background: '#162167', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 },
        row: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
        username: { fontWeight: 'bold', fontSize: '14px', color: '#162167', cursor: 'pointer', textDecoration: 'underline' },
        time: { fontSize: '12px', color: '#aaa', marginLeft: 'auto' },
        restaurantName: (loading) => ({ fontWeight: 'bold', color: loading ? '#aaa' : '#162167', cursor: 'pointer', fontSize: '15px', margin: '0 0 4px 0' }),
        stars: { color: '#f59e0b', fontSize: '14px' },
        empty: { textAlign: 'center', padding: '60px 20px', color: '#aaa' },
        searchInput: { width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Arial, Helvetica, sans-serif', marginBottom: '16px' },
        userRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'white', border: '1px solid #f0f0f0', borderRadius: '12px', marginBottom: '8px' },
        followBtn: (f) => ({ padding: '6px 16px', borderRadius: '20px', border: '2px solid #162167', background: f ? '#162167' : 'white', color: f ? 'white' : '#162167', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif' }),
        likeBar: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f5f5f5' },
        likeBtn: (active, color) => ({ background: active ? color : 'white', border: `1.5px solid ${active ? color : '#ddd'}`, borderRadius: '6px', padding: '5px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: active ? 'white' : '#555', fontFamily: 'Arial, Helvetica, sans-serif', transition: 'all 0.1s' }),
        commentToggle: { fontSize: '13px', color: '#162167', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'Arial, Helvetica, sans-serif', padding: '6px 0', textDecoration: 'underline', display: 'block', marginTop: '8px' },
        commentSection: { marginTop: '12px', borderTop: '1px solid #f5f5f5', paddingTop: '12px' },
        commentRow: { display: 'flex', gap: '8px', marginBottom: '10px', fontSize: '13px', alignItems: 'flex-start' },
        commentUser: { fontWeight: 'bold', color: '#162167', flexShrink: 0, cursor: 'pointer' },
        commentInputWrap: { marginTop: '12px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' },
        commentInputLabel: { fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px', display: 'block' },
        commentInput: { display: 'flex', flexDirection: 'column', gap: '8px' },
        commentField: { width: '100%', padding: '12px 14px', border: '2px solid #c8cfe8', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Arial, Helvetica, sans-serif', boxSizing: 'border-box', resize: 'vertical', minHeight: '70px' },
        postBtn: { alignSelf: 'flex-end', padding: '10px 24px', background: '#162167', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', fontFamily: 'Arial, Helvetica, sans-serif' },
    };

    const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

    return (
        <div style={s.page}>
            <h1 style={s.heading}>Social</h1>
            <p style={s.subtext}>See what your friends have been eating</p>

            <div style={s.tabs}>
                <button style={s.tab(activeTab === 'feed')} onClick={() => setActiveTab('feed')}>Friends' Activity</button>
                <button style={s.tab(activeTab === 'people')} onClick={() => setActiveTab('people')}>Find People</button>
            </div>

            {activeTab === 'feed' && (
                <>
                    {loading ? (
                        [1,2,3].map(i => (
                            <div key={i} style={s.card}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{ ...s.avatar, background: '#e8e8e8' }} />
                                    <div>
                                        <div style={{ width: '100px', height: '13px', background: '#e8e8e8', borderRadius: '6px', marginBottom: '6px' }} />
                                        <div style={{ width: '130px', height: '11px', background: '#f0f0f0', borderRadius: '6px' }} />
                                    </div>
                                    <div style={{ marginLeft: 'auto', width: '40px', height: '11px', background: '#f0f0f0', borderRadius: '6px' }} />
                                </div>
                                <div style={{ width: '160px', height: '15px', background: '#e8e8e8', borderRadius: '6px', marginBottom: '8px' }} />
                                <div style={{ width: '80px', height: '13px', background: '#f0f0f0', borderRadius: '6px', marginBottom: '8px' }} />
                                <div style={{ width: '100%', height: '11px', background: '#f0f0f0', borderRadius: '6px', marginBottom: '5px' }} />
                                <div style={{ width: '75%', height: '11px', background: '#f0f0f0', borderRadius: '6px' }} />
                            </div>
                        ))
                    ) : feed.reviews.length === 0 && feed.visits.length === 0 ? (
                        <div style={s.empty}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍽️</div>
                            <p style={{ fontWeight: 'bold', color: '#555', margin: '0 0 8px 0' }}>No activity yet</p>
                            <p style={{ margin: 0, fontSize: '14px' }}>Follow some friends to see their reviews and visits here</p>
                        </div>
                    ) : (
                        <>
                            {feed.reviews.length > 0 && (
                                <>
                                    <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#555' }}>Friends' Reviews</h3>
                                    {feed.reviews.map((r) => (
                                        <div key={r.review_id} style={s.card}>
                                            <div style={s.row}>
                                                <div style={s.avatar}>{r.username[0].toUpperCase()}</div>
                                                <div>
                                                    <div style={s.username} onClick={() => navigate(`/profile/${r.user_id}`)}>{r.username}</div>
                                                    <div style={{ fontSize: '12px', color: '#aaa' }}>reviewed a restaurant</div>
                                                </div>
                                                <span style={s.time}>{timeAgo(r.created_at)}</span>
                                            </div>
                                            <p
                                                style={s.restaurantName(loadingPlace === r.restaurant_name)}
                                                onClick={() => handleRestaurantClick(r.restaurant_name)}
                                            >
                                                {loadingPlace === r.restaurant_name ? 'Loading...' : r.restaurant_name}
                                            </p>
                                            <div style={s.stars}>{renderStars(r.rating)}</div>
                                            {r.title && <p style={{ fontWeight: 'bold', margin: '6px 0 2px 0', fontSize: '13px' }}>{r.title}</p>}
                                            {r.review_text && <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.5 }}>{r.review_text}</p>}

                                            {/* Like / Dislike bar */}
                                            <div style={s.likeBar}>
                                                <button style={s.likeBtn(r.user_vote === 'like', '#162167')} onClick={() => toggleLike(r.review_id, 'like')}>
                                                    ▲ Like {r.like_count || 0}
                                                </button>
                                                <button style={s.likeBtn(r.user_vote === 'dislike', '#e74c3c')} onClick={() => toggleLike(r.review_id, 'dislike')}>
                                                    ▼ Dislike {r.dislike_count || 0}
                                                </button>
                                            </div>

                                            {/* Comment toggle — separate row */}
                                            <button style={s.commentToggle} onClick={() => toggleComments(r.review_id)}>
                                                {expandedComments[r.review_id] ? 'Hide comments' : `View ${Number(r.comment_count) > 0 ? r.comment_count : ''} comment${Number(r.comment_count) !== 1 ? 's' : ''}`}
                                            </button>

                                            {/* Comments section */}
                                            {expandedComments[r.review_id] && (
                                                <div style={s.commentSection}>
                                                    {(comments[r.review_id] || []).length === 0 && (
                                                        <p style={{ fontSize: '13px', color: '#aaa', margin: '0 0 10px' }}>No comments yet. Be the first!</p>
                                                    )}
                                                    {(comments[r.review_id] || []).map(c => (
                                                        <div key={c.id} style={s.commentRow}>
                                                            <span style={s.commentUser} onClick={() => navigate(`/profile/${c.user_id}`)}>{c.username}</span>
                                                            <span style={{ color: '#333', flex: 1 }}>{c.comment_text}</span>
                                                            <span style={{ color: '#bbb', fontSize: '11px', whiteSpace: 'nowrap' }}>{timeAgo(c.created_at)}</span>
                                                        </div>
                                                    ))}
                                                    <div style={s.commentInputWrap}>
                                                        <span style={s.commentInputLabel}>Leave a comment</span>
                                                        <div style={s.commentInput}>
                                                            <textarea
                                                                style={s.commentField}
                                                                placeholder="Share your thoughts..."
                                                                value={commentInputs[r.review_id] || ''}
                                                                onChange={e => setCommentInputs(prev => ({ ...prev, [r.review_id]: e.target.value }))}
                                                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); postComment(r.review_id); } }}
                                                            />
                                                            <button style={s.postBtn} onClick={() => postComment(r.review_id)}>Send</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}

                            {feed.visits.length > 0 && (
                                <>
                                    <h3 style={{ margin: '20px 0 12px 0', fontSize: '1rem', color: '#555' }}>Friends' Visits</h3>
                                    {feed.visits.map((v, i) => (
                                        <div key={i} style={s.card}>
                                            <div style={s.row}>
                                                <div style={s.avatar}>{v.username[0].toUpperCase()}</div>
                                                <div>
                                                    <div style={s.username} onClick={() => navigate(`/profile/${v.user_id}`)}>{v.username}</div>
                                                    <div style={{ fontSize: '12px', color: '#aaa' }}>visited a restaurant</div>
                                                </div>
                                                <span style={s.time}>{timeAgo(v.viewed_at)}</span>
                                            </div>
                                            <p
                                                style={s.restaurantName(loadingPlace === v.restaurant_name)}
                                                onClick={() => handleRestaurantClick(v.restaurant_name)}
                                            >
                                                {loadingPlace === v.restaurant_name ? 'Loading...' : v.restaurant_name}
                                            </p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </>
            )}

            {/* FIND PEOPLE */}
            {activeTab === 'people' && (
                <>
                    <input
                        type="text"
                        placeholder="Search for friends by username..."
                        value={searchUser}
                        onChange={(e) => { setSearchUser(e.target.value); loadUsers(e.target.value); }}
                        style={s.searchInput}
                    />
                    {users.length === 0 ? (
                        <div style={s.empty}>
                            <p style={{ margin: 0, fontSize: '14px' }}>No users found</p>
                        </div>
                    ) : (
                        users.map((u) => (
                            <div key={u.id} style={s.userRow}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate(`/profile/${u.id}`)}>
                                    <div style={s.avatar}>{u.username[0].toUpperCase()}</div>
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{u.username}</span>
                                </div>
                                <button style={s.followBtn(u.is_following)} onClick={() => toggleFollow(u.id)}>
                                    {u.is_following ? 'Following ✓' : 'Follow'}
                                </button>
                            </div>
                        ))
                    )}
                </>
            )}
        </div>
    );
}
