import { useEffect, useState } from 'react';
import '../styles/reviewPage.css';

const userCache = {};

export default function SocialPage() {
    const [feed, setFeed] = useState({ reviews: [], visits: [] });
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('feed');

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

    const timeAgo = (dateStr) => {
        const diff = (Date.now() - new Date(dateStr)) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const avatar = (name) => (
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#162167', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 }}>
            {name[0].toUpperCase()}
        </div>
    );

    return (
        <div style={{ paddingTop: '68px', maxWidth: '800px', margin: '0 auto', padding: '80px 24px 40px 24px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '1.6rem', fontWeight: 'bold' }}>Social</h1>
            <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>See what your friends have been eating</p>

            <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0', marginBottom: '24px' }}>
                {['feed', 'people'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: 'none', border: 'none',
                            borderBottom: activeTab === tab ? '3px solid #162167' : '3px solid transparent',
                            padding: '10px 20px',
                            fontWeight: activeTab === tab ? 'bold' : 'normal',
                            color: activeTab === tab ? '#162167' : '#aaa',
                            cursor: 'pointer', fontSize: '15px', marginBottom: '-2px'
                        }}
                    >
                        {tab === 'feed' ? "Friends' Activity" : 'Find People'}
                    </button>
                ))}
            </div>

            {activeTab === 'feed' && (
                <>
                    {loading ? (
                        <p style={{ color: '#aaa', textAlign: 'center' }}>Loading feed...</p>
                    ) : feed.reviews.length === 0 && feed.visits.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
                            <p style={{ fontWeight: 'bold', color: '#555', margin: '0 0 8px 0' }}>No activity yet</p>
                            <p style={{ margin: 0, fontSize: '14px' }}>Follow some friends to see their reviews and visits here</p>
                        </div>
                    ) : (
                        <>
                            {feed.reviews.length > 0 && (
                                <>
                                    <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#555' }}>Friends' Reviews</h3>
                                    {feed.reviews.map((r, i) => (
                                        <div key={i} className="social-card">
                                            <div className="card-header">
                                                {avatar(r.username)}
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{r.username}</div>
                                                    <div style={{ fontSize: '12px', color: '#aaa' }}>reviewed a restaurant</div>
                                                </div>
                                                <span style={{ fontSize: '12px', color: '#aaa', marginLeft: 'auto' }}>{timeAgo(r.created_at)}</span>
                                            </div>
                                            <p style={{ fontWeight: 'bold', color: '#162167', fontSize: '15px', margin: '0 0 4px 0' }}>{r.restaurant_name}</p>
                                            <div style={{ color: '#f59e0b', fontSize: '14px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                                            {r.title && <p style={{ fontWeight: 'bold', margin: '6px 0 2px 0', fontSize: '13px' }}>{r.title}</p>}
                                            {r.review_text && <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.5 }}>{r.review_text}</p>}
                                        </div>
                                    ))}
                                </>
                            )}

                            {feed.visits.length > 0 && (
                                <>
                                    <h3 style={{ margin: '20px 0 12px 0', fontSize: '1rem', color: '#555' }}>Friends' Visits</h3>
                                    {feed.visits.map((v, i) => (
                                        <div key={i} className="social-card">
                                            <div className="card-header">
                                                {avatar(v.username)}
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{v.username}</div>
                                                    <div style={{ fontSize: '12px', color: '#aaa' }}>visited a restaurant</div>
                                                </div>
                                                <span style={{ fontSize: '12px', color: '#aaa', marginLeft: 'auto' }}>{timeAgo(v.viewed_at)}</span>
                                            </div>
                                            <p style={{ fontWeight: 'bold', color: '#162167', fontSize: '15px', margin: 0 }}>{v.restaurant_name}</p>
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </>
            )}

            {activeTab === 'people' && (
                <>
                    <input
                        type="text"
                        placeholder="Search for friends by username..."
                        value={searchUser}
                        onChange={(e) => { setSearchUser(e.target.value); loadUsers(e.target.value); }}
                        style={{ width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
                    />
                    {users.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '14px', marginTop: '40px' }}>No users found</p>
                    ) : (
                        users.map((u) => (
                            <div key={u.id} className="user-card">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {avatar(u.username)}
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{u.username}</span>
                                </div>
                                <button
                                    onClick={() => toggleFollow(u.id)}
                                    style={{
                                        padding: '6px 16px', borderRadius: '20px',
                                        border: '2px solid #162167',
                                        background: u.is_following ? '#162167' : 'white',
                                        color: u.is_following ? 'white' : '#162167',
                                        fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
                                    }}
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