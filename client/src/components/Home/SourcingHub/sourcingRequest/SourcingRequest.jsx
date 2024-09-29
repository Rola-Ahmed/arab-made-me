import "./sourcingh.css";
import SourcingRequestCard from "components/Sourcinghub/SourcingRequest/SourcingRequestCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useAppTranslation } from "config";

function SourcingRequest(props) {
  let {
    allSourcingReqData,
    accessFormSourcingRequest,
    datacompletelyLoaded,
    apiStatus,
  } = props;
  const { trans: t } = useAppTranslation();

  return (
    <div className="row pt-3 w-100  m-0 ">
      {allSourcingReqData?.length == 0 && !apiStatus?.laoding && (
        <div className="">
          <p className="fs-15 text-muted fw-bolder  mt-5 pt-3 mx-auto w-fit-content text-center">
            {t("translation:searchResult.noItemsMessage1")}
            <br />
            {t("translation:searchResult.noItemsMessage2")}
          </p>
        </div>
      )}
      <Swiper
        // modules={[Navigation]}
        modules={[Navigation]}
        navigation={{
          nextEl: ".sourcing-h-hom .arrowRight",
          prevEl: ".sourcing-h-hom .arrowLeft",
        }}
        spaceBetween={10}
        slidesPerView={1.2}
        breakpoints={{
          779: {
            slidesPerView: 2,
          },
          1202: {
            slidesPerView: 3,
          },
        }}
      >
        {allSourcingReqData?.map((item) => (
          <SwiperSlide>
            <SourcingRequestCard
              reqData={item}
              accessFormSourcingRequest={accessFormSourcingRequest}
              datacompletelyLoaded={datacompletelyLoaded}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default SourcingRequest;
