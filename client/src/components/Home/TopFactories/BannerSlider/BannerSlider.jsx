import { handleImageError } from "utils/ImgNotFound";
import { baseUrl_IMG } from "config.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

export default function BannerSlider(props) {
  let { factoryitem } = props;
  return (
    <Swiper pagination={{ clickable: true }} modules={[Pagination]}>
      {factoryitem?.images?.map((item, index) => (
        <SwiperSlide>
          <img
            key={item?.id}
            src={`${baseUrl_IMG}/${item}`}
            className="sliderImg w-100"
            alt={`slide ${item} `}
            onError={handleImageError}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
