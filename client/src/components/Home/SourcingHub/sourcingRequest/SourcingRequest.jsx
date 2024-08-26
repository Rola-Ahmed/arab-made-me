import { useEffect, useState, useContext } from "react";
import "./sourcingh.css";
import axios from "axios";
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

const displayProductSize = 20;

function SourcingRequest() {
  // utils function
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);

  const [allSourcingReqData, setAllSourcingReqData] = useState([]);

  const [modalShow, setModalShow] = useState({
    isFactoryVerified: false,
    isImporterVerified: false,
    BecomeAfactory: false,
  });

  async function fetchSourcingReqData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/sourcingRequests/?size=${displayProductSize}&include=importer`,
      };

      const response = await axios.request(config);

      setAllSourcingReqData(response.data?.sourcingrequests);
    } catch (error) {}
  }

  useEffect(() => {
    fetchSourcingReqData();
  }, []);

  console.log("allSourcingReqData", allSourcingReqData);

  return (
    <>
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
          {allSourcingReqData?.map((item) => (
            <SwiperSlide>
              <SourcingRequestCard
                reqData={item}
                setModalShow={setModalShow}
                isLogin={isLogin}
                currentUserData={currentUserData}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

export default SourcingRequest;
