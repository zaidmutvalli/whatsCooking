import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SocialPage() {
    const [feed, setFeed] = useState({ reviews: [], visits: [] });
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('feed');
    const navigate = useNavigate();

    useEffect(() => {
        loadFeed();
        loadUsers('');
    }, []);

    const loadFeed = async () => {
        try {
            const res = await fetch('http://localhost:8888/get_social_feed.php', { credentials: 'include' });
            const data = await res.json();
            if (data.status === 'success') setFeed(data);
        } catch {}
        setLoading(false);
    };

    const loadUsers = async (q) => {
        try {
            const res = await fetch(`http://localhost:8888/get_users.php?q=${q}`, { credentials: 'include' });
            const data = await res.json();
            if (data.status === 'success') setUsers(data.users);
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
                // Update local state
                setUsers(prev => prev.map(u =>
                    u.id === userId ? { ...u, is_following: data.action === 'followed' ? 1 : 0 } : u
                ));
                if (data.action === 'followed') loadFeed();
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

    const styles = {
        page: { paddingTop: '68px', maxWidth: '800px', margin: '0 auto', padding: '80px 24px 40px 24px', fontFamily: 'Arial, Helvetica, sans-serif' },
        heading: { margin: '0 0 4px 0', fontSize: '1.6rem', fontWeight: 'bold' },
        subtext: { color: '#888', marginBottom: '24px', fontSize: '14px' },
        tabs: { display: 'flex', gap: '0', borderBottom: '2px solid #f0f0f0', marginBottom: '24px' },
        tab: (active) => ({
            background: 'none', border: 'none', borderBottom: active ? '3px solid #162167' : '3px solid transparent',
            padding: '10px 20px', fontWeight: active ? 'bold' : 'normal', color: active ? '#162167' : '#aaa',
            cursor: 'pointer', fontSize: '15px', marginBottom: '-2px', fontFamily: 'Arial, Helvetica, sans-serif'
        }),
        card: { background: 'white', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
        avatar: { width: '38px', height: '38px', borderRadius: '50%', background: '#162167', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 },
        row: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
        username: { fontWeight: 'bold', fontSize: '14px', color: '#1a1a1a' },
        time: { fontSize: '12px', color: '#aaa', marginLeft: 'auto' },
        restaurantName: { fontWeight: 'bold', color: '#162167', cursor: 'pointer', fontSize: '15px', margin: '0 0 4px 0' },
        reviewText: { fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.5 },
        stars: { color: '#f59e0b', fontSize: '14px' },
        empty: { textAlign: 'center', padding: '60px 20px', color: '#aaa' },
        emptyIcon: { fontSize: '48px', marginBottom: '12px' },
        searchInput: { width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Arial, Helvetica, sans-serif', marginBottom: '16px' },
        userRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'white', border: '1px solid #f0f0f0', borderRadius: '12px', marginBottom: '8px' },
        followBtn: (following) => ({
            padding: '6px 16px', borderRadius: '20px', border: `2px solid #162167`,
            background: following ? '#162167' : 'white', color: following ? 'white' : '#162167',
            fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', fontFamily: 'Arial, Helvetica, sans-serif'
        }),
    };

    const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

    return (
        <div style={styles.page}>
            <h1 style={styles.heading}>👥 Social</h1>
            <p style={styles.subtext}>See what your friends have been eating</p>

            {/* Tabs */}
            <div style={styles.tabs}>
                <button style={styles.tab(activeTab === 'feed')} onClick={() => setActiveTab('feed')}>Friends' Activity</button>
                <button style={styles.tab(activeTab === 'people')} onClick={() => setActiveTab('people')}>Find People</button>
            </div>

            {/* FEED TAB */}
            {activeTab === 'feed' && (
                <>
                    {loading ? (
                        <p style={{ color: '#aaa', textAlign: 'center' }}>Loading feed...</p>
                    ) : feed.reviews.length === 0 && feed.visits.length === 0 ? (
                        <div style={styles.empty}>
                            <div style={styles.emptyIcon}>🍽️</div>
                            <p style={{ fontWeight: 'bold', color: '#555', margin: '0 0 8px 0' }}>No activity yet</p>
                            <p style={{ margin: 0, fontSize: '14px' }}>Follow some friends to see their reviews and visits here</p>
                        </div>
                    ) : (
                        <>
                            {/* Reviews */}
                            {feed.reviews.length > 0 && (
                                <>
                                    <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#555' }}>⭐ Friends' Reviews</h3>
                                    {feed.reviews.map((r, i) => (
                                        <div key={i} style={styles.card}>
                                            <div style={styles.row}>
                                                <div style={styles.avatar}>{r.username[0].toUpperCase()}</div>
                                                <div>
                                                    <div style={styles.username}>{r.username}</div>
                                                    <div style={{ fontSize: '12px', color: '#aaa' }}>reviewed a restaurant</div>
                                                </div>
                                                <span style={styles.time}>{timeAgo(r.created_at)}</span>
                                            </div>
                                            <p style={styles.restaurantName}>{r.restaurant_name}</p>
                                            <div style={styles.stars}>{renderStars(r.rating)}</div>
                                            {r.title && <p style={{ fontWeight: 'bold', margin: '6px 0 2px 0', fontSize: '13px' }}>{r.title}</p>}
                                            {r.review_text && <p style={styles.reviewText}>{r.review_text}</p>}
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Visits */}
                            {feed.visits.length > 0 && (
                                <>
                                    <h3 style={{ margin: '20px 0 12px 0', fontSize: '1rem', color: '#555' }}>📍 Friends' Visits</h3>
                                    {feed.visits.map((v, i) => (
                                        <div key={i} style={styles.card}>
                                            <div style={styles.row}>
                                                <div style={styles.avatar}>{v.username[0].toUpperCase()}</div>
                                                <div>
                                                    <div style={styles.username}>{v.username}</div>
                                                    <div style={{ fontSize: '12px', color: '#aaa' }}>visited a restaurant</div>
                                                </div>
                                                <span style={styles.time}>{timeAgo(v.viewed_at)}</span>
                                            </div>
                                            <p style={styles.restaurantName}>{v.restaurant_name}</p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </>
            )}

            {/* FIND PEOPLE TAB */}
            {activeTab === 'people' && (
                <>
                    <input
                        type="text"
                        placeholder="Search for friends by username..."
                        value={searchUser}
                        onChange={(e) => { setSearchUser(e.target.value); loadUsers(e.target.value); }}
                        style={styles.searchInput}
                    />
                    {users.length === 0 ? (
                        <div style={styles.empty}>
                            <div style={styles.emptyIcon}>👤</div>
                            <p style={{ margin: 0, fontSize: '14px' }}>No users found</p>
                        </div>
                    ) : (
                        users.map((u) => (
                            <div key={u.id} style={styles.userRow}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={styles.avatar}>{u.username[0].toUpperCase()}</div>
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{u.username}</span>
                                </div>
                                <button
                                    style={styles.followBtn(u.is_following)}
                                    onClick={() => toggleFollow(u.id)}
                                >
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