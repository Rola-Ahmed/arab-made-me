const StarRating = ({ averageRating }) => {
  const totalStars = Math.floor(averageRating); // Use ceil to round up for partial stars

  // Create an array with the number of filled stars
  const stars = Array.from({ length: totalStars }, (_, index) => "fa-star");

  if (!Number.isInteger(averageRating)) {
    stars.push("fa-star-half");
  }

  return (
    <div className="star-rating">
      {stars.map((status) => (
        <i
          className={`fa-solid ${status}`}
          style={{ color: "var(--star-color)" }}
        ></i>
      ))}
    </div>
  );
};

export default StarRating;
