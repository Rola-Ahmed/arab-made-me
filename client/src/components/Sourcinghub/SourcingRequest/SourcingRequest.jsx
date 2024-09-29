import { useEffect, useState, useContext } from "react";

import Header from "components/main/Header/Header";
import { userDetails } from "Context/userType";
import "../source.css";
import { UserToken } from "Context/userToken";
import { useNavigate, useSearchParams } from "react-router-dom";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";
import SourcingRequestCard from "./SourcingRequestCard";
import PublicPaginate from "components/Shared/PublicPaginate";
import { getSourcingReuqests } from "Services/sourcingReuqest";
import Loading from "components/Loading/Loading";
import { accessFormSourcingRequest } from "utils/actionBtns/HandleUsersBtnAccess";
import DefaultUserNotAuthorizedModal from "components/ActionMessages/FormAccessControl/DefaultUserNotAuthorizedModal";
import { updateUrlParamString } from "utils/updateUrlParams";
import { useAppTranslation } from "config";

const filtersKeyword = {
  byBuyerRequest: "searchBuyerRequest",
};

function Sourcinghub() {
  document.title = "Sourcing Hub";
  const [searchParams] = useSearchParams();

  let { currentUserData } = useContext(userDetails);
  const filterSearchBuyerRequest = searchParams.get("searchBuyerRequest");
  const { trans: t } = useAppTranslation();

  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();

  const [reqData, setReqData] = useState([]);
  const [filter, setFilter] = useState({
    [filtersKeyword.byBuyerRequest]: filterSearchBuyerRequest || "",
  });
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

  async function fetchSourcingReqData(params2) {
    let params = `size=${pagination?.displayProductSize}&page=${pagination?.currentPage}&include=importer`;
    if (params2) {
      params += params2;
    }
    let result = await getSourcingReuqests(params);

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
    fetchSourcingReqData(
      `&sourcingFilter=${filter[filtersKeyword.byBuyerRequest]}`
    );
  }, [pagination?.currentPage, filter]);

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

  function updateOtherFilters(value, keyword) {
    setFilter((prev) => ({ ...prev, [keyword]: value }));

    updateUrlParamString(keyword, value);
  }

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

      <DefaultUserNotAuthorizedModal
        show={modalShow.isDefaultUserNotAllowed}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isDefaultUserNotAllowed: false,
          }))
        }
        // userType="User"
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

      <Header title="Sourcing Hub" />

      <div className="container  sourcing-pg">
        <ul className="nav  mb-3 mt-5" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="x-3 py-1 fw-600 rounded-2 bg-sec  border-0"
              type="button"
              onClick={() => navigate(`/sourcinghub/sourcingRequests`)}
            >
              Buyer Requests
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              type="button"
              role="tab"
              className="px-3 py-1 fw-600 rounded-2 border-0 bg-0"
              onClick={() => navigate(`/sourcinghub/sourcingOffers`)}
            >
              Factory Offers
            </button>
          </li>
        </ul>

        {reqData?.length == 0 && apiLoadingData?.laoding == true ? (
          <>
            {apiLoadingData?.errorMsg ? (
              <p className="fs-15 text-muted fw-bolder text-5 mt-5 pt-5 mx-auto w-fit-content">
                {apiLoadingData?.errorMsg}
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
              <div className=" col-xxl-10 col-xl-10  col-lg-10  col-md-9  col-sm-9  col-9  ">
                <input
                  type="text"
                  className="in h-25 overflow-hidden  w-100 rounded-3 border w-100"
                  placeholder="Search here product name"
                  defaultValue={filter[filtersKeyword.byBuyerRequest]}
                  id="searchTermSecotr"
                  name="searchTermSecotr"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateOtherFilters(e.target.value, [
                        filtersKeyword.byBuyerRequest,
                      ]);
                    }
                  }}
                />
              </div>
              <div className=" col-xxl-2 col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3 ">
                <button
                  type="button"
                  className="filt-btn h-25 rounded-3 border-0 bg-main  text-white w-100 fs-16-semi  m-auto"
                  onClick={(_e) => {
                    let value = document?.getElementById("searchTermSecotr")
                      ?.value;

                    updateOtherFilters(value, [filtersKeyword.byBuyerRequest]);
                  }}
                >
                  Search
                </button>
              </div>

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

        {apiLoadingData?.laoding == false && reqData?.length == 0 && (
          <div>
            <p dangerouslySetInnerHTML={{ __html: t('translation:searchResult.noItemsMessage') }} className="fs-15 text-muted text-center fw-bolder text-5 mt-5 pt-5 mx-auto w-fit-content" />
              {/* {t("translation:searchResult.noItemsMessage")} */}
            {/* </p> */}
            
          </div>
        )}

        <PublicPaginate pagination={pagination} setPagination={setPagination} />
      </div>
    </>
  );
}

export default Sourcinghub;
