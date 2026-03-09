import React, { useState } from 'react';
import DisplayReviews from '../Components/DisplayReviews';
import DisplayMap from '../Components/map';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/map.css';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

export default function AboutRestaurant() {
  const { state } = useLocation();
  const place = state?.place;
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState(null); 

  if (!place) {
    return (
      <div style={{ paddingTop: '100px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <p>No restaurant selected. <span style={{ color: '#162167', cursor: 'pointer' }} onClick={() => navigate('/')}>Go back home</span></p>
      </div>
    );
  }

  const getPhotoUrl = (index = 0, size = 800) => {
    if (place.photos && place.photos.length > index) {
      return `https://places.googleapis.com/v1/${place.photos[index].name}/media?key=${apiKey}&maxHeightPx=${size}&maxWidthPx=${size}`;
    }
    return 'https://via.placeholder.com/800x600?text=No+Image';
  };

  const formatPrice = (p) => {
    switch (p) {
      case 'PRICE_LEVEL_INEXPENSIVE': return '£ · Budget Friendly';
      case 'PRICE_LEVEL_MODERATE': return '££ · Mid-range';
      case 'PRICE_LEVEL_EXPENSIVE': return '£££ · Upscale';
      case 'PRICE_LEVEL_VERY_EXPENSIVE': return '££££ · Fine Dining';
      default: return '';
    }
  };

  const photoCount = Math.min(place.photos?.length || 1, 5);

  return (
    <div style={{ paddingTop: '68px', fontFamily: 'Arial, Helvetica, sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>

      {/* Back button */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '12px 24px 0 24px' }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#162167',
          fontSize: '14px', fontWeight: 'bold', padding: '0', display: 'flex', alignItems: 'center', gap: '4px'
        }}>← Back</button>
      </div>

      {/* Restaurant name & rating above photos */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '12px 24px 12px 24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '1.7rem', fontWeight: 'bold', color: '#1a1a1a' }}>
          {place.displayName?.text}
        </h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {place.rating && (
            <span style={{ background: '#162167', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
              ⭐ {place.rating} · {place.userRatingCount?.toLocaleString()} reviews
            </span>
          )}
          {place.priceLevel && (
            <span style={{ background: '#f0f0f0', color: '#555', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
              {formatPrice(place.priceLevel)}
            </span>
          )}
        </div>
      </div>

      
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 24px 24px' }}>
        {photoCount === 1 ? (
          
          <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#111', maxHeight: '420px', display: 'flex', justifyContent: 'center', cursor: 'pointer' }} onClick={() => setLightbox(0)}>
            <img src={getPhotoUrl(0, 1200)} alt="" style={{ maxHeight: '420px', maxWidth: '100%', objectFit: 'contain', display: 'block' }} />
          </div>
        ) : photoCount === 2 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderRadius: '16px', overflow: 'hidden', height: '380px' }}>
            {[0, 1].map(i => (
              <div key={i} style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLightbox(i)}>
                <img src={getPhotoUrl(i, 800)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.2s' }}
                  onMouseOver={e => e.target.style.transform = 'scale(1.03)'}
                  onMouseOut={e => e.target.style.transform = 'scale(1)'} />
              </div>
            ))}
          </div>
        ) : (
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px', height: '400px', borderRadius: '16px', overflow: 'hidden' }}>
            
            <div style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLightbox(0)}>
              <img src={getPhotoUrl(0, 1200)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.2s' }}
                onMouseOver={e => e.target.style.transform = 'scale(1.03)'}
                onMouseOut={e => e.target.style.transform = 'scale(1)'} />
            </div>
            {/* Right grid */}
            <div style={{ display: 'grid', gridTemplateRows: photoCount >= 4 ? '1fr 1fr' : '1fr', gap: '8px' }}>
              {photoCount >= 4 ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[1, 2].map(i => (
                      <div key={i} style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLightbox(i)}>
                        <img src={getPhotoUrl(i, 600)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.2s' }}
                          onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                          onMouseOut={e => e.target.style.transform = 'scale(1)'} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: photoCount >= 5 ? '1fr 1fr' : '1fr', gap: '8px' }}>
                    {[3, 4].slice(0, photoCount >= 5 ? 2 : 1).map(i => (
                      <div key={i} style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }} onClick={() => setLightbox(i)}>
                        <img src={getPhotoUrl(i, 600)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.2s' }}
                          onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                          onMouseOut={e => e.target.style.transform = 'scale(1)'} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLightbox(1)}>
                  <img src={getPhotoUrl(1, 800)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' }}>✕</button>
          {lightbox > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setLightbox(l => l - 1); }} style={{ position: 'absolute', left: '16px', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', fontSize: '24px', padding: '10px 16px', borderRadius: '50%', cursor: 'pointer' }}>‹</button>
          )}
          <img src={getPhotoUrl(lightbox, 1600)} alt="" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '8px' }} />
          {lightbox < photoCount - 1 && (
            <button onClick={(e) => { e.stopPropagation(); setLightbox(l => l + 1); }} style={{ position: 'absolute', right: '16px', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', fontSize: '24px', padding: '10px 16px', borderRadius: '50%', cursor: 'pointer' }}>›</button>
          )}
          <div style={{ position: 'absolute', bottom: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{lightbox + 1} / {photoCount}</div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

          {/* LEFT */}
          <div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 'bold', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>About</h3>
              {place.editorialSummary?.text && <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.6, marginBottom: '16px' }}>{place.editorialSummary.text}</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  
                  <div>
                    <p style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px 0' }}>Address</p>
                    <p style={{ fontSize: '14px', color: '#444', margin: 0 }}>{place.formattedAddress}</p>
                  </div>
                </div>
                {place.priceLevel && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px 0' }}>Price</p>
                      <p style={{ fontSize: '14px', color: '#444', margin: 0 }}>{formatPrice(place.priceLevel)}</p>
                    </div>
                  </div>
                )}
                {place.rating && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px 0' }}>Rating</p>
                      <p style={{ fontSize: '14px', color: '#444', margin: 0 }}>{place.rating} out of 5 · {place.userRatingCount?.toLocaleString()} reviews</p>
                    </div>
                  </div>
                )}

                {/* Opening Hours */}
                {place.currentOpeningHours?.weekdayDescriptions && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px 0' }}>Opening Hours</p>
                      {/* Open/Closed badge */}
                      {place.currentOpeningHours?.openNow !== undefined && (
                        <span style={{
                          display: 'inline-block', marginBottom: '8px',
                          background: place.currentOpeningHours.openNow ? '#dcfce7' : '#fee2e2',
                          color: place.currentOpeningHours.openNow ? '#16a34a' : '#dc2626',
                          padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold'
                        }}>
                          {place.currentOpeningHours.openNow ? 'Open Now' : 'Closed'}
                        </span>
                      )}
                      {place.currentOpeningHours.weekdayDescriptions.map((day, i) => {
                        const [dayName, hours] = day.split(': ');
                        const isToday = i === (new Date().getDay() + 6) % 7;
                        return (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '3px 0', color: isToday ? '#162167' : '#555', fontWeight: isToday ? 'bold' : 'normal' }}>
                            <span>{dayName}</span>
                            <span>{hours}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Phone & Website */}
                {place.nationalPhoneNumber && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px 0' }}>Phone</p>
                      <a href={`tel:${place.nationalPhoneNumber}`} style={{ fontSize: '14px', color: '#162167', textDecoration: 'none' }}>{place.nationalPhoneNumber}</a>
                    </div>
                  </div>
                )}
                {place.websiteUri && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    
                    <div>
                      <p style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px 0' }}>Website</p>
                      <a href={place.websiteUri} target="_blank" rel="noreferrer" style={{ fontSize: '14px', color: '#162167', textDecoration: 'none' }}>Visit website ↗</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 'bold', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>Reviews</h3>
              <DisplayReviews resName={place?.displayName?.text} />
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '16px' }}>
              <div style={{ height: '220px' }}>
                <DisplayMap lat={place?.location?.latitude ?? 0} lng={place?.location?.longitude ?? 0} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>Location</p>
                <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5 }}>{place.formattedAddress}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/addReview', { state: { place } })}
              style={{ width: '100%', padding: '14px', background: '#162167', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', fontFamily: 'Arial, Helvetica, sans-serif', marginBottom: '10px' }}
              onMouseOver={e => e.target.style.background = '#0e103c'}
              onMouseOut={e => e.target.style.background = '#162167'}
            >Write a Review</button>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.formattedAddress)}`}
              target="_blank" rel="noreferrer"
              style={{ display: 'block', width: '100%', padding: '13px', background: 'white', color: '#162167', border: '2px solid #162167', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', fontFamily: 'Arial, Helvetica, sans-serif', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}
            >Get Directions</a>
          </div>
        </div>
      </div>
    </div>
  );
}
