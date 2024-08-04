import { vid1 } from "constants/Images";
import backgroundImg from "assets/images/notFound.png";

export const handleImageError = (event) => {
  return (event.target.src = backgroundImg);
};

export const handleVedioError = (event) => {
  return (event.target.src = vid1);
};
