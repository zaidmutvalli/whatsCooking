import React from 'react';
import ReviewLeftSide from '../Components/review-leftside';
import RightSide from '../Components/review-rightside';

export default function AddReview() {
    return (
        <div className="addReviewContainer">
            <div className="leftSide">
                <ReviewLeftSide />
            </div>
            <div className="horizontalLine"></div>
            <div className="rightSide">
                <RightSide />



            </div>
        </div>
    );
}