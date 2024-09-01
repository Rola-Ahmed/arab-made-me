import { useState, useContext, useEffect } from "react";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "components/main/Header/Header";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import { getOneSourcingReq } from "Services/sourcingReuqest";
import Loading from "components/Loading/Loading";
import ImporterInfo from "components/Shared/ImporterInfo";
import SourcingRequestInfo from "components/Shared/Dashboards/Forms/SourcingRequestInfo";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import { accessFormSourcingRequest } from "utils/actionBtns/HandleUsersBtnAccess";

function OneSourcingReq() {
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [isLoading, setIsLoading] = useState({
    loading: true,
    errorMsg: "",
  });
  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });
  const handleImageClick = (imagePath) => {
    setShowImagePop({
      display: true,
      imagePath,
    });
  };

  const [searchParams] = useSearchParams();
  const productName = searchParams.get("productName");
  const sourcingRequestId = searchParams.get("sourcingRequestId");

  const [PosData, setPosData] = useState();
  let sendQuote = `answerQuotation/SourcingReq?id=${sourcingRequestId}&productName=${productName}&userId=${PosData?.importerId}`;

  const [modalShow, setModalShow] = useState({
    isFactoryVerified: false,
    isLogin: false,
    isImporterVerified: false,
    BecomeAfactory: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  async function fetchReqData() {
    let result = await getOneSourcingReq(sourcingRequestId, "include=importer");
    if (result?.success) {
      setPosData(result.data.sourcingrequests);
    }
    setIsLoading((prev) => ({
      ...prev,
      loading: result?.loadingStatus,
      errorMsg: result?.error,
    }));
  }

  useEffect(() => {
    fetchReqData();
  }, [sourcingRequestId]);

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

  return (
    <>
      {/* user not logged in */}
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

      {/* user is importer */}
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
      {/* factory  not verified*/}

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

      <Header title="Sourcing Request " />

      {/* if data is not loaded */}
      {isLoading?.loading && (
        <>
          {isLoading?.errorMsg ? (
            <p className="fs-5 text-muted fw-bolder text-5 my-5 py-5 mx-auto">
              {isLoading?.errorMsg || "No records Found"}
            </p>
          ) : (
            <div className=" d-flex justify-content-center py-5">
              <Loading title="Sourcing Request Details" />
            </div>
          )}
        </>
      )}

      {/* show data  */}
      {!isLoading?.loading && (
        <>
          <section id="view" className="send-po">
            <div className="container container-po ">
              <ImporterInfo importerData={PosData?.importer} />
            </div>
            {/* Grid  */}
            {/* col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  */}
            <div className="container container-po">
              <SourcingRequestInfo
                requestedData={PosData}
                handleImageClick={handleImageClick}
              />

              <div className="action row">
                <div className="col-12">
                  <button
                    className="action-btn btn-1 w-100 submitButton"
                    onClick={() => {
                      handleFactoryAccessForm(sendQuote);
                    }}
                  >
                    Send Quotation
                  </button>
                </div>
              </div>
            </div>
          </section>

          <MediaPopUp
            show={showImagePop.display}
            onHide={() =>
              setShowImagePop({
                display: false,
                imagePath: "",
              })
            }
            showImagePop={showImagePop.imagePath}
          />
        </>
      )}
    </>
  );
}

export default OneSourcingReq;
