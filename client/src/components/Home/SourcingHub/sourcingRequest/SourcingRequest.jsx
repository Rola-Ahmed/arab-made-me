import { useEffect, useState, useContext } from "react";
import "./sourcingh.css";
import { UserToken } from "Context/userToken";
import SourcingRequestCard from "components/Sourcinghub/SourcingRequest/SourcingRequestCard";

import { userDetails } from "Context/userType";
import { baseUrl, useAppTranslation } from "config.js";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";

import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";

import SourcingOffers from "components/Home/SourcingHub/SourcingOffers/SourcingOffers";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";


function SourcingRequest() {
  // utils function
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);

  return (
    <div className="row pt-3 w-100  m-0 ">
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
        {/* {allSourcingReqData?.map((item) => (
          <SwiperSlide>
            <SourcingRequestCard
              reqData={item}
              setModalShow={setModalShow}
              isLogin={isLogin}
              currentUserData={currentUserData}
            />
          </SwiperSlide>
        ))} */}
      </Swiper>
    </div>
  );
}

export default SourcingRequest;
