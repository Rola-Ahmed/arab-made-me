import { useState, useContext } from "react";

import { UserToken } from "Context/userToken";

import { userDetails } from "Context/userType";
import { useAppTranslation } from "config.js";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";

import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";

import SourcingOffers from "components/Home/SourcingHub/SourcingOffers/SourcingOffers";
import SourcingRequest from "./sourcingRequest/SourcingRequest";
import { useNavigate } from "react-router-dom";
import { useSourcingRequests } from "hooks/useSourcingRequests";
import { useSourcingOffers } from "hooks/useSourcingOffers";
import HandleUsersBtnAccess from "utils/actionBtns/HandleUsersBtnAccess";

const displayProductSize = 20;
let displayProductSizeOffer = 100;

function SourcingHub() {
  // utils function
  let { currentUserData } = useContext(userDetails);
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);
  const { trans: t, currentLang } = useAppTranslation();
  let { allSourcingRequest, apiStatus } = useSourcingRequests(
    displayProductSize
  );

  let { allSourcingOffer, apiStatus: offerStatus } = useSourcingOffers(
    displayProductSizeOffer
  );

  const [modalShow, setModalShow] = useState({
    isFactoryVerified: false,
    isImporterVerified: false,
    BecomeAfactory: false,
  });


  const accessFormSourcingRequest = (directto) => {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));

      return;
    }

    if (
      currentUserData?.userRole == "importer" ||
      currentUserData?.userRole == "admin"
    ) {
      // if (currentUserData?.importerId !== null) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isImporterVerified: true,
      }));

      return;
    }

    if (currentUserData?.userRole == "user") {
      setModalShow((prevVal) => ({
        ...prevVal,
        isUser: true,
      }));

      return;
    }

    if (
      currentUserData?.userRole == "factory" &&
      currentUserData?.continueProfilePath != null
    ) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isFactoryVerified: true,
      }));

      return;
    } else {
      navigate(directto);
    }
  };

  // const handleUserClickValidation1 = (gotoPath) => {
  //   HandleUsersBtnAccess({
  //     currentUserData,
  //     isLogin,
  //     navigate,
  //     setModalShow,
  //     setisLoggedReDirect,
  //     gotoPath,
  //   });
  // };

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
        // distination={isLoggedReDirect}

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
        goToPath="CompanyDetails"
      />

      <FactoryUnVerified
        show={modalShow.isFactoryVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isFactoryVerified: false,
          }))
        }
        goToPath={currentUserData?.continueProfilePath}
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
            accessFormSourcingRequest={accessFormSourcingRequest}
            datacompletelyLoaded={currentUserData?.datacompletelyLoaded}
          />

          <SourcingOffers
            allSourcingOffer={allSourcingOffer}
            apiStatus={offerStatus}
            assessFormOPAuth={HandleUsersBtnAccess}
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
