import { baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";
import { pdfIcon } from "constants/Images";
import Carousel from "react-grid-carousel";

export default function DisplayMultiImages(props) {
  let { handleImageClick, images } = props;
  console.log("images",images)
  return (
    <>
      {" "}
      {images?.length > 0 ? (
        <div className="w-100 ">
          <div className="row grid-gap-col">
            <div className="col-12">
              <Carousel
                cols={2}
                rows={1}
                gap={10}
                scrollSnap={true}
                loop
                showDots
                hideArrow={false}
              >
                {images?.map((item) => (
                  <Carousel.Item>
                    <div
                      className="dots-slider-img w-100  cursor"
                      onClick={() => {
                        handleImageClick(`${baseUrl_IMG}/${item}`);
                      }}
                    >
                      <img
                        className="h-100 w-100 "
                        id={handleImageError}
                        src={
                          item?.includes("pdf")
                            ? pdfIcon
                            : `${baseUrl_IMG}/${item}`
                        }
                        alt={item?.pdfFile?.name?.includes("pdf")}
                        onError={handleImageError}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
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
