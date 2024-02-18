import React from "react";
import { StarRatingIcon } from "../../assets/icons.constants";
import "./StarRatingComponent.scss";

function StarRatingComponent(props) {
  const { className = "", numberOfReview = 0, ValueRate = 5 } = props;

  return (
    <div className={`star-rating ${className}`}>
      <StarRatingIcon />
      <div className="value-rate">{ValueRate}</div>
      <div className="number-of-review">({numberOfReview})</div>
    </div>
  );
}

export default StarRatingComponent;
