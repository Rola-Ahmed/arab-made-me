import CustomSlider from "react-slick";
import { handleImageError } from "utils/ImgNotFound";
import { baseUrl_IMG } from "config.js";

export default function BannerSlider(props) {
  let { factoryitem } = props;
  const settings = {
    dots: true,
    fade: true,
    arrows: false,
    appendDots: (dots) => (
      <div
        style={{
          height: "1rem",
          bottom: "1.5rem",
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          top: "10rem",
          zIndex: 1,
        }}
      >
        {dots}
      </div>
    ),

    focusOnSelect: true,
  };
  return (
    <CustomSlider {...settings}>
      {factoryitem?.images?.map((item, index) => (
        <img
          key={item?.id}
          src={`${baseUrl_IMG}/${item}`}
          className="sliderImg"
          alt={`slide ${item} `}
          onError={handleImageError}
        />
      ))}

      <img
        src={`${baseUrl_IMG}/${factoryitem?.coverImage}`}
        className="sliderImg"
        alt={`slide coverImage `}
        onError={handleImageError}
      />
    </CustomSlider>
  );
}
