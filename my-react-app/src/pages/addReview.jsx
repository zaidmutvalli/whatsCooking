import React from 'react';
import { useLocation } from 'react-router-dom';
import ReviewLeftSide from '../Components/review-leftside';
import RightSide from '../Components/review-rightside';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

export default function AddReview() {
    const { state } = useLocation();
    const place = state?.place;

    const resName = place?.displayName?.text || "Unknown Restaurant";

    const resImage = place?.photos?.length > 0
        ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${apiKey}&maxHeightPx=400&maxWidthPx=400`
        : "https://via.placeholder.com/300x400?text=No+Image";

    return (
        <div className="addReviewContainer">
            <div className="leftSide">
                <ReviewLeftSide resName={resName} resImage={resImage} />
            </div>
            <div className="horizontalLine"></div>
            <div className="rightSide">
                <RightSide resName={resName} place={place} />
            </div>
        </div>
    );
}