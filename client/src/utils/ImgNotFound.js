import backgroundImg from"assets/images/notFound.png";

export const handleImageError = (event) => {
  return (event.target.src = backgroundImg);
};


