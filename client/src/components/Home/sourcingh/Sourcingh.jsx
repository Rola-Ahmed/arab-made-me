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

import SourcingOffers from "components/Home/SourcingOffers/SourcingOffers";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

function Sourcingh() {
  // utils function
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);
  const { trans: t, currentLang } = useAppTranslation();

  const [allSourcingReqData, setAllSourcingReqData] = useState([]);
  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );
  const [apiLoadingData, setApiLoadingData] = useState(true);
  const displayProductSize = 20;

  const [modalShow, setModalShow] = useState({
    isFactoryVerified: false,
    isImporterVerified: false,
    BecomeAfactory: false,
  });

  async function fetchSourcingReqData() {
    setApiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/sourcingRequests/?size=${displayProductSize}`,
      };

      const response = await axios.request(config);
      setAllSourcingReqData(response.data?.sourcingrequests);
      const uniqueIds = [
        ...new Set(
          response.data?.sourcingrequests
            .map((obj) => obj.importerId) // Extract all factoryIds
            .filter((id) => id !== null) // Filter out null values
        ),
      ];

      setUniqueFactoryIDofProducts(uniqueIds);
      setApiLoadingData(false);
    } catch (error) {
      setApiLoadingData(true);
    }
  }

  useEffect(() => {
    fetchSourcingReqData();
  }, []);

  useEffect(() => {
    // Promise.all(
    uniqueFactoryIDofProducts.map(async (importerID) => {
      try {
        const productResponse = await axios.get(
          `${baseUrl}/importers/${importerID}`
        );

        if (productResponse.data.message === "done") {
          setAllSourcingReqData((prevData) =>
            prevData.map((value) =>
              value?.importerId === importerID
                ? {
                    ...value,
                    importerName: productResponse?.data?.importers?.name,
                  }
                : value
            )
          );
        }
      } catch (error) {}
    });
  }, [apiLoadingData]);

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
                  item={item}
                  setModalShow={setModalShow}
                  isLogin={isLogin}
                  currentUserData={currentUserData}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <SourcingOffers />
      </div>
    </section>
  );
}

export default Sourcingh;
