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
function Sourcinghub() {
  document.title = "Sourcing Hub";
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();

  const [reqData, setReqData] = useState([]);

  const [modalShow, setModalShow] = useState({
    isFactoryVerified: false,
    isLogin: false,
    isImporterVerified: false,
    BecomeAfactory: false,
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
  // console.log("hiiiiiiiiiiiiiiiiii", currentUserData?.continueProfilePath);
  // console.log("hiiiiiiiiiiiiiiiiii");

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
        userType="user"
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
      />

      <Header title="Sourcing Hub" />

      <div
        className="container sourcing-hub-section-pg sourcing-pg"
        id="sourcing-pg"
      >
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              className={`btn-sourcing btn-warning`}
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
              onClick={() => navigate(`/sourcinghub/sourcingRequests`)}
            >
              Requests
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
              className={`btn-sourcing `}
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
          <div class="tab-content mt-5" id="pills-tabContent">
            <div class=" row">
              {reqData?.map((item) => (
                <div className="col-lg-4 sour-card gy-4">
                  <SourcingRequestCard
                    item={item}
                    setModalShow={setModalShow}
                    isLogin={isLogin}
                    currentUserData={currentUserData}
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
