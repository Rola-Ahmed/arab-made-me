import { useEffect, useState, useContext } from "react";

import axios from "axios";
import { UserToken } from "Context/userToken";
// import SourcingRequestCard from "components/Sourcinghub/SourcingRequest/SourcingRequestCard";

import { userDetails } from "Context/userType";
import { baseUrl, useAppTranslation } from "config.js";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";

import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";

import SourcingOffers from "components/Home/SourcingHub/SourcingOffers/SourcingOffers";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
import SourcingRequest from "./sourcingRequest/SourcingRequest";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const displayProductSize = 20;

function SourcingHub() {
  // utils function
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);
  const { trans: t, currentLang } = useAppTranslation();

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
    <section className="margin-sm-screen">
      <IsLoggedIn
        show={modalShow.isLogin}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
        distination={`/signIn`}
      />

      <UserNotAuthorized
        show={modalShow.isImporterVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isImporterVerified: false,
          }))
        }
        userType="Factory"
      />
      <UserNotAuthorized
        show={modalShow.isUser}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isUser: false,
          }))
        }
        userType="User"
        goToPath={"CompanyDetails"}
      />

      <FactoryUnVerified
        goToPath={currentUserData?.continueProfilePath}
        show={modalShow.isFactoryVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isFactoryVerified: false,
          }))
        }
        // userType="Factory"
      />

      <div className={`container sourcing-h-hom   home-padding-y `}>
        <p
          className={`header-Title  ${currentLang == "ar" && "ar-text-left"} `}
        >
          {" "}
          {t("translation:titles.SourcingHub")}
        </p>
        <div
          className={`d-flex justify-content-between ${
            currentLang == "ar" && "ar-flex-reverse"
          }`}
        >
          <p
            className={`fs-20-semi pb-2 ${
              currentLang == "ar" && "ar-text-left fw-900"
            }`}
          >
            {t("translation:titles.buyerRequests")}
          </p>

          <div className="d-flex arrow-container gap-2">
            <div className="arrow-btn position-static arrowLeft  carousel rounded-5">
              <i className="fa-solid fa-chevron-left"></i>
            </div>

            <div className="arrow-btn position-static arrowRight carousel rounded-5">
              <i className="fa-solid fa-chevron-right"></i>
            </div>
          </div>
        </div>
        <SourcingRequest />

        <SourcingOffers />
      </div>
    </section>
  );
}

export default SourcingHub;
