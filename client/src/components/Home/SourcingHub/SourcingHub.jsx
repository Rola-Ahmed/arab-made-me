import { useEffect, useState, useContext } from "react";

import { UserToken } from "Context/userToken";

import { userDetails } from "Context/userType";
import { useAppTranslation } from "config.js";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";

import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";

import SourcingOffers from "components/Home/SourcingHub/SourcingOffers/SourcingOffers";
import SourcingRequest from "./sourcingRequest/SourcingRequest";
import { getSourcingReuqests } from "Services/sourcingReuqest";
import { useNavigate } from "react-router-dom";

const displayProductSize = 20;
let displayProductSizeOffer = 100;

function SourcingHub() {
  // utils function
  let { currentUserData } = useContext(userDetails);
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);
  const { trans: t, currentLang } = useAppTranslation();
  const [allSourcingReqData, setAllSourcingReqData] = useState([]);
  const [allSourcingOffer, setAllSourcingOffer] = useState([]);



  const [modalShow, setModalShow] = useState({
    isFactoryVerified: false,
    isImporterVerified: false,
    BecomeAfactory: false,
  });
  const [apiStatus, setApiStatus] = useState({});
  async function fetchSourcingReqData() {
    let result = await getSourcingReuqests(
      `size=${displayProductSize}&include=importer`
    );

    if (result?.success) {
      setAllSourcingReqData(result.data?.sourcingrequests);
    }

    setApiStatus({
      loadingPage: result?.loadingStatus,
      errorCausedMsg: result?.error,
    });
  }

  useEffect(() => {
    fetchSourcingReqData();
  }, []);

  return (
    <>
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

      <section className="margin-sm-screen">
        <div className={`container sourcing-h-hom   home-padding-y `}>
          <p
            className={`header-Title  ${
              currentLang == "ar" && "ar-text-left"
            } `}
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
          <SourcingRequest
            apiStatus={apiStatus}
            allSourcingReqData={allSourcingReqData}
          />

          <SourcingOffers />

          <div className="btn-container-all cursor">
            <div
              className="get-all-btn text-decoration-none text-white cursor"
              onClick={() => {
                navigate("/sourcinghub/SourcingRequests");
              }}
            >
              Sourcing Hub
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SourcingHub;
