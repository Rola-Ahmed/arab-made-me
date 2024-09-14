import { baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";
import { pdfIcon } from "constants/Images";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
export default function DisplayMultiImages(props) {
  let { handleImageClick, images, deleteDocs } = props;
  return (
    <>
      {" "}
      {images?.length > 0 ? (
        <div className="overflow-hidden w-100 h-100">
          <Swiper
            modules={[Navigation]}
            navigation={true}
            slidesPerView={2}
            gap={20}
            className="h-100"
          >
            {images?.map((item, index) => (
              <SwiperSlide className="pe-3 h-100">
                <div
                  className="dots-slider-img w-100  h-100   position-relative"
                  // onClick={() => {
                  //   handleImageClick(`${baseUrl_IMG}/${item}`);
                  // }}
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
                  <button
                    className="position-absolute zoom-icon   bg-0  border-0 "
                    onClick={() => {
                      handleImageClick(`${baseUrl_IMG}/${item}`);
                    }}
                    type="button"
                  >
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </button>

                  {deleteDocs && (
                    <button
                      className="position-absolute delete-img   bg-white rounded-3  border-1 border-danger "
                      type="button"
                      onClick={() => {
                        deleteDocs(index);
                      }}
                    >
                      <i class="fa-solid fa-trash  text-danger "></i>
                    </button>
                  )}
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
