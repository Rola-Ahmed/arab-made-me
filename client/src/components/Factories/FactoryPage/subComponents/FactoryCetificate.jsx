import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

export default function FactoryCetificate({
  qualityCertificates,
  handleImageError,
  baseUrl_IMG,
}) {
  return (
    <>
      <h3 className="text-fac-4">Certificates</h3>

      <div className="row justify-content-between vh-75">
        <div className="col-12">
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={2}
            spaceBetween={10}
            navigation={true}
            pagination={true}
          >
            {qualityCertificates?.map((item) => (
              <SwiperSlide>
                <div
                  className="dots-slider-img w-100 vh-80 "
                  // style={{ height: "75vh" }}
                >
                  <img
                    className="h-100 w-100 object-fit-contain "
                    src={`${baseUrl_IMG}/${item}`}
                    alt="Img"
                    onError={handleImageError}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
