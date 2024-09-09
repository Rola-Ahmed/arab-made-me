import { useState, useContext } from "react";

import { UserToken } from "Context/userToken";

import { userDetails } from "Context/userType";
import { useAppTranslation } from "config.js";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";

import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";

import SourcingOffers from "components/Home/SourcingHub/SourcingOffers/SourcingOffers";
import SourcingRequest from "./sourcingRequest/SourcingRequest";
import { useNavigate } from "react-router-dom";
import { useSourcingRequests } from "hooks/useSourcingRequests";
import { useSourcingOffers } from "hooks/useSourcingOffers";
import HandleUsersBtnAccess, {
  accessFormSourcingRequest,
} from "utils/actionBtns/HandleUsersBtnAccess";
import DefaultUserNotAuthorizedModal from "components/ActionMessages/FormAccessControl/DefaultUserNotAuthorizedModal";

const displayProductSize = 20;
let displayProductSizeOffer = 100;

function SourcingHub() {
  // utils function
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();
  const { trans: t, currentLang } = useAppTranslation();
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  let { allSourcingRequest, apiStatus } = useSourcingRequests(
    displayProductSize
  );

  let { allSourcingOffer, apiStatus: offerStatus } = useSourcingOffers(
    displayProductSizeOffer
  );

  const [modalShow, setModalShow] = useState({
    //  Indicates that the factory user is allowed and verified.
    isFactoryAllowedAndVerified: false,
    // Indicates that a general user is not allowed.
    isUserNotAllowed: false,
    //Indicates that a default user is not allowed.
    isDefaultUserNotAllowed: false,
    isLogin: false,
  });
  // console.log("modalShow", modalShow);

  const handleFactoryAccessForm = (directto) => {
    accessFormSourcingRequest({
      currentUserData,
      isLogin,
      navigate,
      setModalShow,
      setisLoggedReDirect,
      directto,
    });
  };

  const handleImporterAccessForms = (loginPath) => {
    HandleUsersBtnAccess({
      currentUserData,
      isLogin,
      navigate,
      setModalShow,
      setisLoggedReDirect,
      loginPath,
    });
  };

  return (
    <>
      {/* both button check */}
      <IsLoggedIn
        show={modalShow.isLogin}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
        distination={isLoggedReDirect}
      />
      {/* both button check */}
      <UserNotAuthorized
        show={modalShow.isUserNotAllowed}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isUserNotAllowed: false,
          }))
        }
        userType="Factory"
      />
      <DefaultUserNotAuthorizedModal
        show={modalShow.isDefaultUserNotAllowed}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isDefaultUserNotAllowed: false,
          }))
        }
        // goToPath="CompanyDetails"
        goToPath="userType"
      />

      <FactoryUnVerified
        show={modalShow.isFactoryAllowedAndVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isFactoryAllowedAndVerified: false,
          }))
        }
        goToPath={currentUserData?.continueProfilePath}
      />

      {/* in case of accessing  */}

      <ImporterUnVerified
        show={modalShow.isImporterVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isImporterVerified: false,
          }))
        }
      />

      <UserNotAuthorized
        show={modalShow.isFactoryVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isFactoryVerified: false,
          }))
        }
        userType="Buyer"
      />

      <section className="margin-sm-screen">
        <div className={`container sourcing-h-hom   home-padding-y `}>
          <p
            className={`header-Title pb-3 ${
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

            <div className="d-flex  gap-12 bg-ingo">
              <div className="arrow-btn  arrowLeft ">
                <i className="fa-solid fa-chevron-left"></i>
              </div>

              <div className="arrow-btn  arrowRight">
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          </div>
          <SourcingRequest
            // apiStatus={apiStatus}
            allSourcingReqData={allSourcingRequest}
            accessFormSourcingRequest={handleFactoryAccessForm}
            datacompletelyLoaded={currentUserData?.datacompletelyLoaded}
          />

          <SourcingOffers
            allSourcingOffer={allSourcingOffer}
            apiStatus={offerStatus}
            assessFormOPAuth={handleImporterAccessForms}
          />

          <div className="mx-auto pt-60 w-fit-content">
            <button
              className="get-all-btn  fs-15-semi  rounded-3"
              onClick={() => {
                navigate("/sourcinghub/SourcingRequests");
              }}
            >
              {t("translation:titles.SourcingHub")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default SourcingHub;
