import { useEffect, useState, useContext } from "react";

import Header from "components/main/Header/Header";
import { useNavigate } from "react-router-dom";
import PublicPaginate from "components/Shared/PublicPaginate";
import { getSourcingOffers } from "Services/sourcingOffer";
import SourcingOfferTable from "./SourcingOfferTable";
import Loading from "components/Loading/Loading";
import { UserToken } from "Context/userToken";
import HandleUsersBtnAccess from "utils/actionBtns/HandleUsersBtnAccess";

import { userDetails } from "Context/userType";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import ImporterUnVerified from "components/ActionMessages/ImporterUnVerified/ImporterUnVerifiedPopUpMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";

function SourcingOffers() {
  let navigate = useNavigate();
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);

  document.title = "Sourcing Hub";
  const [allSourcingReqData, setAllSourcingReqData] = useState([]);
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  const [apiLoadingData, setapiLoadingData] = useState({
    laoding: true,
    errorMsg: "",
  });

  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 600,
    currentPage: 1,
    totalPage: 1,
  }));

  const [modalShow, setModalShow] = useState({
    //  Indicates that the factory user is allowed and verified.
    isFactoryAllowedAndVerified: false,
    // Indicates that a general user is not allowed.
    isUserNotAllowed: false,
    //Indicates that a default user is not allowed.
    isDefaultUserNotAllowed: false,
    isLogin: false,
  });

  async function fetchSourcingReqData() {
    // setapiLoadingData(true);

    let params = `size=${pagination?.displayProductSize}&page=${pagination?.currentPage}`;
    let result = await getSourcingOffers(params);

    if (result?.success) {
      setAllSourcingReqData(result.data?.sourcingoffers);
      setPagination((prevValue) => ({
        ...prevValue,
        totalPage: Math.ceil(
          (result.data.sourcingoffers?.length || 1) /
            prevValue.displayProductSize
        ),
      }));
    }

    // is still loading that means there is error, so i will display message error
    // loading happens in 2 cases
    setapiLoadingData((prevValue) => ({
      ...prevValue,
      laoding: result?.loadingStatus,
      errorMsg: result?.error,
    }));
  }

  useEffect(() => {
    fetchSourcingReqData();
  }, [pagination?.currentPage]);

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

  // utils function

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
      {/* both button check */}

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

      <Header title="Sourcing Hub" />
      <div className="container sourcing-hub-section-pg sourcing-pg">
        <ul className="nav  mb-3 mt-5" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`px-3 py-1 fw-600 rounded-2 border-0 bg-0 `}
              type="button"
              role="tab"
              onClick={() => navigate(`/sourcinghub/sourcingRequests`)}
            >
              Requests
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              type="button"
              role="tab"
              className={`px-3 py-1 fw-600 rounded-2 bg-sec  border-0`}
              onClick={() => navigate(`/sourcinghub/sourcingOffers`)}
            >
              Offers
            </button>
          </li>
        </ul>

        <div className="row pt-5">
          <div className="col-12">
            <div className="border-container-2">
              <SourcingOfferTable
                allSourcingReqData={allSourcingReqData}
                assessFormOPAuth={handleImporterAccessForms}
              />

              {apiLoadingData?.laoding && (
                <div className="d-flex justify-content-center py-5">
                  {apiLoadingData?.errorMsg ? (
                    <p className="fs-5 text-muted fw-bolder text-5 mt-5 pt-5 mx-auto">
                      {apiLoadingData?.errorMsg}
                    </p>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <Loading />
                    </div>
                  )}
                </div>
              )}
              {allSourcingReqData?.length == 0 && !apiLoadingData?.laoding && (
                <div className="d-flex justify-content-center py-5">
                  <p className="fs-5 text-muted fw-bolder text-5 mb-5 pt-3 mx-auto">
                    No Records Found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* </div> */}

        <PublicPaginate pagination={pagination} setPagination={setPagination} />
      </div>
    </>
  );
}

export default SourcingOffers;
