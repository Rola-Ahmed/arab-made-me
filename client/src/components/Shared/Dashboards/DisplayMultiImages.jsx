import { baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";
import { pdfIcon } from "constants/Images";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
export default function DisplayMultiImages(props) {
  let { handleImageClick, images } = props;
  console.log("images", images);
  return (
    <>
      {" "}
      {images?.length > 0 ? (
        <div className="w-100 ">
          <div className="row grid-gap-col overflow-hidden">
            <div className="col-12 ">
              <Swiper
                modules={[Navigation]}
                navigation={true}
                slidesPerView={2}
                gap={10}
              >
                {images?.map((item) => (
                  <SwiperSlide>
                    <div
                      className="dots-slider-img w-100  cursor"
                      onClick={() => {
                        handleImageClick(`${baseUrl_IMG}/${item}`);
                        console.log(
                          "`${baseUrl_IMG}/${item}`",
                          `${baseUrl_IMG}/${item}`
                        );
                      }}
                    >
                      {/* {item} */}
                      <img
                        className="h-100 w-100 bg-info "
                        id={handleImageError}
                        src={
                          item?.includes("pdf")
                            ? pdfIcon
                            : `${baseUrl_IMG}/${item}`
                        }
                        // src={`http://localhost:5000/uploads/images-1724072365669-k-qcrOcazzQc2Hf7Iz_gqparralel5.PNG`}
                        alt={
                          item?.includes("pdf")
                            ? pdfIcon
                            : `${baseUrl_IMG}/${item}`
                        }
                        onError={handleImageError}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      ) : (
        <h5 className="text-muted text-center py-3 border-3 m-auto d-block">
          Empty
        </h5>
      )}
    </>
  );
}
