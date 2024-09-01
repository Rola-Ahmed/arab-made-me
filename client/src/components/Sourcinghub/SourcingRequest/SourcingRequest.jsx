import { useEffect, useState, useContext } from "react";

import Header from "components/main/Header/Header";
import { userDetails } from "Context/userType";
import "../source.css";
import { UserToken } from "Context/userToken";
import { useNavigate } from "react-router-dom";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";
import SourcingRequestCard from "./SourcingRequestCard";
import PublicPaginate from "components/Shared/PublicPaginate";
import { getSourcingReuqests } from "Services/sourcingReuqest";
import Loading from "components/Loading/Loading";
import { accessFormSourcingRequest } from "utils/actionBtns/HandleUsersBtnAccess";

function Sourcinghub() {
  document.title = "Sourcing Hub";
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();

  const [reqData, setReqData] = useState([]);

  const [isLoggedReDirect, setisLoggedReDirect] = useState("");
  const [modalShow, setModalShow] = useState({
    //  Indicates that the factory user is allowed and verified.
    isFactoryAllowedAndVerified: false,
    // Indicates that a general user is not allowed.
    isUserNotAllowed: false,
    //Indicates that a default user is not allowed.
    isDefaultUserNotAllowed: false,
    isLogin: false,
  });

  const [apiLoadingData, setapiLoadingData] = useState({
    laoding: true,
    errorMsg: "",
  });

  const [pagination, setPagination] = useState(() => ({
    displayProductSize: 8,
    currentPage: 1,
    totalPage: 1,
  }));

  async function fetchSourcingReqData() {
    let result = await getSourcingReuqests(
      `size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&include=importer`
    );

    if (result?.success) {
      setReqData(result.data?.sourcingrequests);

      setPagination((prevValue) => ({
        ...prevValue,
        totalPage: Math.ceil(
          (result.data.sourcingrequests?.length || 1) /
            prevValue.displayProductSize
        ),
      }));
    }

    setapiLoadingData({
      laoding: result?.loadingStatus,
      errorMsg: result?.error,
    });
  }

  useEffect(() => {
    fetchSourcingReqData();
  }, [pagination?.currentPage]);

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

      <Header title="Sourcing Hub" />

      <div
        className="container  sourcing-pg"
      >
        <ul className="nav  mb-3 mt-5" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="x-3 py-1 fw-600 rounded-2 bg-sec  border-0"
              type="button"
              onClick={() => navigate(`/sourcinghub/sourcingRequests`)}
            >
              Requests
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              type="button"
              role="tab"
              className="px-3 py-1 fw-600 rounded-2 border-0 bg-0"
              onClick={() => navigate(`/sourcinghub/sourcingOffers`)}
            >
              Offers
            </button>
          </li>
        </ul>

        {reqData?.length == 0 ? (
          <>
            {apiLoadingData?.errorMsg ? (
              <p className="fs-5 text-muted fw-bolder text-5 mt-5 pt-5 mx-auto">
                {apiLoadingData?.errorMsg || "No records Found"}
              </p>
            ) : (
              <div className="d-flex justify-content-center">
                <Loading />
              </div>
            )}
          </>
        ) : (
          <div className="tab-content mt-5" id="pills-tabContent">
            <div className=" row">
              {reqData?.map((item) => (
                <div className="col-lg-4 sour-card gy-4">
                  <SourcingRequestCard
                    reqData={item}
                    accessFormSourcingRequest={handleFactoryAccessForm}
                    datacompletelyLoaded={currentUserData?.datacompletelyLoaded}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <PublicPaginate pagination={pagination} setPagination={setPagination} />
      </div>
    </>
  );
}

export default Sourcinghub;
