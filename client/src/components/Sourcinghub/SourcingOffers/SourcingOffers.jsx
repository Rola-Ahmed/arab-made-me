import { useEffect, useState, useContext } from "react";

import Header from "components/main/Header/Header";
import { useSearchParams } from "react-router-dom";

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
import DefaultUserNotAuthorizedModal from "components/ActionMessages/FormAccessControl/DefaultUserNotAuthorizedModal";
import { updateUrlParamString } from "utils/updateUrlParams";

const filtersKeyword = {
  byOffer: "searchOffer",
  // byBuyerRequest: "searchBuyerRequest",
};
function SourcingOffers() {
  let navigate = useNavigate();
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);
  const [searchParams] = useSearchParams();

  const filterSearchOffer = searchParams.get("searchOffer");
  // const filterSearchBuyerRequest = searchParams.get("filterSearchBuyerRequest");

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
  const [filter, setFilter] = useState({
    [filtersKeyword.byOffer]: filterSearchOffer || "",
    // [filtersKeyword.byBuyerRequest]: filterSearchBuyerRequest || "",
  });

  const [modalShow, setModalShow] = useState({
    //  Indicates that the factory user is allowed and verified.
    isFactoryAllowedAndVerified: false,
    // Indicates that a general user is not allowed.
    isUserNotAllowed: false,
    //Indicates that a default user is not allowed.
    isDefaultUserNotAllowed: false,
    isLogin: false,
  });

  async function fetchSourcingReqData(params2) {
    // setapiLoadingData(true);

    let params = `size=${pagination?.displayProductSize}&page=${pagination?.currentPage}`;
    if (params2) {
      params += params2;
    }

    let result = await getSourcingOffers(params);
    console.log("params2",result,params2,filter)

    if (result?.success) {
      setAllSourcingReqData(result.data?.sourcingoffers);
      setPagination((prevValue) => ({
        ...prevValue,
        totalPage: result?.pagination?.totalPages,
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
  console.log("params2 filter",filter)

  useEffect(() => {
    fetchSourcingReqData(`&sourcingFilter=${filter[filtersKeyword.byOffer]}`);
  }, [pagination?.currentPage, filter]);

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
      {/* both button check */}

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
              Buyer Requests
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              type="button"
              role="tab"
              className={`px-3 py-1 fw-600 rounded-2 bg-sec  border-0`}
              onClick={() => navigate(`/sourcinghub/sourcingOffers`)}
            >
              Factory Offers
            </button>
          </li>
        </ul>

        <div
          className="row 
        "
        >
          <div className=" col-xxl-10 col-xl-10  col-lg-10  col-md-9  col-sm-9  col-9  ">
            <input
              type="text"
              className="in h-25 overflow-hidden  w-100 rounded-3 border w-100"
              placeholder="Search here product name"
              defaultValue={filter[filtersKeyword.byOffer]}
              id="searchTermSecotr"
              name="searchTermSecotr"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateOtherFilters(e.target.value, [filtersKeyword.byOffer]);
                }
              }}
            />
          </div>
          <div className=" col-xxl-2 col-xl-2 col-lg-2 col-md-3 col-sm-3 col-3 ">
            <button
              type="button"
              className="filt-btn h-25 rounded-3 border-0 bg-main  text-white w-100 fs-16-semi  m-auto"
              onClick={(_e) => {
                let value = document?.getElementById("searchTermSecotr")?.value;

                updateOtherFilters(value, [filtersKeyword.byOffer]);
              }}
            >
              Search
            </button>
          </div>
          <div className="col-12">
            <div className="border-container-2 ">
              <SourcingOfferTable
                allSourcingReqData={allSourcingReqData}
                assessFormOPAuth={handleImporterAccessForms}
              />

              {apiLoadingData?.laoding && (
                <div className="d-flex justify-content-center py-5">
                  {apiLoadingData?.errorMsg ? (
                    <p className="fs-15 text-muted fw-bolder text-5 mt-5 pt-3 mx-auto">
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
                  <p className="fs-15 text-muted fw-bolder text-5 mb-5 pt-3 mx-auto">
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
