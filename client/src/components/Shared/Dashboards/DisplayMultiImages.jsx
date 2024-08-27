import { baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";
import { pdfIcon } from "constants/Images";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
export default function DisplayMultiImages(props) {
  let { handleImageClick, images } = props;
  return (
    <>
      {" "}
      {images?.length > 0 ? (
        <div className="overflow-hidden w-100">
          <Swiper
            modules={[Navigation]}
            navigation={true}
            slidesPerView={2}
            gap={20}
          >
            {images?.map((item) => (
              <SwiperSlide className="pe-3">
                <div
                  className="dots-slider-img w-100  cursor "
                  onClick={() => {
                    handleImageClick(`${baseUrl_IMG}/${item}`);
                  }}
                >
                  <img
                    className="h-100 w-100     object-fit-contain  "
                    id={handleImageError}
                    src={
                      item?.includes("pdf") ? pdfIcon : `${baseUrl_IMG}/${item}`
                    }
                    alt={
                      item?.includes("pdf") ? pdfIcon : `${baseUrl_IMG}/${item}`
                    }
                    onError={handleImageError}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <h5 className="text-muted text-center py-3 border-3 m-auto d-block">
          Empty
        </h5>
      )}
    </>
  );
}
