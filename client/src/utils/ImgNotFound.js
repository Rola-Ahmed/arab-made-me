import { vid1 } from "constants/Images";
import backgroundImg from "assets/images/Arab-Made transparent logo.png";
import backgroundImg2 from "assets/images/notFound.png";
import backgroundImg3 from "assets/images/arab-logo-text.png";

export const handleImageError = (event) => {
  return (event.target.src = backgroundImg);
};

export const handleLogoTextError = (event) => {
  return (event.target.src = backgroundImg3);
};

export const handleVedioError = (event) => {
  return (event.target.src = vid1);
};

export const handleProfileError = (event) => {
  return (event.target.src = backgroundImg2);
};
