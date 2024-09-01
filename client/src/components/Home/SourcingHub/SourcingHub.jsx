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

  const accessFormSourcingRequest = (directto) => {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));

      setisLoggedReDirect(`/signIn${directto}`);
      return;
    }

    switch (currentUserData?.userRole) {
      case "importer":
      case "admin":
        setModalShow((prevVal) => ({
          ...prevVal,
          isUserNotAllowed: true,
        }));
        return;

      case "user":
        setModalShow((prevVal) => ({
          ...prevVal,
          isDefaultUserNotAllowed: true,
        }));
        return;

      case "factory":
        console.log("enretrttere");
        if (currentUserData?.continueProfilePath != null) {
          setModalShow((prevVal) => ({
            ...prevVal,
            isFactoryAllowedAndVerified: true,
          }));
          // return;
          break;
        }

      default:
        // console.log(currentUserData?.userRole);
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
        distination={isLoggedReDirect}
      />

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
      <UserNotAuthorized
        show={modalShow.isDefaultUserNotAllowed}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isDefaultUserNotAllowed: false,
          }))
        }
        userType="User"
        goToPath="CompanyDetails"
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
