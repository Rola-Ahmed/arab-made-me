import { baseUrl_IMG } from "config.js";
import { handleImageError } from "utils/ImgNotFound";
import { pdfIcon } from "constants/Images";

export default function DisplayOneImage(props) {
  let { handleImageClick, image } = props;
  console.log("image",image)
  return (
    <div className="row grid-gap-col">
      <div className="col-12">
        {image ? (
          <div
            className="dots-slider-img w-100  cursor"
            onClick={() => {
              handleImageClick(`${baseUrl_IMG}/${image}`);
            }}
          >
            <img
              className="h-100 w-100 "
              id={handleImageError}
              src={image?.includes("pdf") ? pdfIcon : `${baseUrl_IMG}/${image}`}
              alt={image?.pdfFile?.name?.includes("pdf")}
              onError={handleImageError}
            />
          </div>
        ) : (
          <h5 className="text-muted text-center py-3 border-3 m-auto d-block">
            Empty
          </h5>
        )}
      </div>
    </div>
  );
}
