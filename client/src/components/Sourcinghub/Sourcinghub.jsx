import React, { useEffect, useState, useContext } from "react";

import Header from "components/main/Header/Header";
import { userDetails } from "Context/userType";

import "./source.css";
import { handleImageError } from "utils/ImgNotFound";

import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import ReactPaginate from "react-paginate";
import { UserToken } from "Context/userToken";

import { useNavigate } from "react-router-dom";
import { getMonthName as getDate } from "utils/getMonthName";

import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import BecomomeAFactory from "components/ActionMessages/BecomeAFactory/BecomeAFactory";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";
function Sourcinghub() {
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);

  let navigate = useNavigate();

  document.title = "Sourcing Hub";

  const [allSourcingReqData, setAllSourcingReqData] = useState([]);
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );
  const [apiLoadingData, setapiLoadingData] = useState(true);

  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 8,

    currentPage: 1,
    totalPage: 1,
    // totalPage: Math.ceil((allProductsData?.length) /pagination.displayProductSize), // Use 30 as the default display size
  }));

  async function fetchSourcingReqData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/sourcingRequests/?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}`,
      };

      const response = await axios.request(config);
      setAllSourcingReqData(response.data?.sourcingrequests);
      const uniqueIds = [
        ...new Set(
          response.data?.sourcingrequests
            .map((obj) => obj.importerId) // Extract all factoryIds
            .filter((id) => id !== null) // Filter out null values
        ),
      ];

      setUniqueFactoryIDofProducts(uniqueIds);
      setapiLoadingData(false);
    } catch (error) {
      setapiLoadingData(true);
    }
  }

  useEffect(() => {
    fetchSourcingReqData();
  }, [pagination?.currentPage]);
  useEffect(() => {
    const fetchDataLenght = async () => {
      try {
        const response1 = await axios.get(
          // `${baseUrl}/sourcingRequests?filter=${filter}`
          `${baseUrl}/sourcingRequests`
        );

        if (response1.data.message === "done") {
          setPagination((prevValue) => ({
            ...prevValue,
            totalPage: Math.ceil(
              (response1.data.sourcingrequests?.length || 0) /
                prevValue.displayProductSize
            ),
          }));
        }
      } catch (error) {}
    };

    fetchDataLenght();
    // }, [filter]);
  }, [pagination?.currentPage]);
  const [modalShow, setModalShow] = useState({
    isFactoryVerified: false,
    isLogin: false,
    isImporterVerified: false,
    BecomeAfactory: false,
  });

  useEffect(() => {
    // Promise.all(
    uniqueFactoryIDofProducts.map(async (importerID) => {
      try {
        const productResponse = await axios.get(
          `${baseUrl}/importers/${importerID}`
        );

        if (productResponse.data.message === "done") {
          setAllSourcingReqData((prevData) =>
            prevData.map((value) =>
              value?.importerId === importerID
                ? {
                    ...value,
                    importerName: productResponse?.data?.importers?.name,
                    importerRepEmail:
                      productResponse?.data?.importers?.repEmail,
                    importerProfileImg:
                      productResponse?.data?.importers?.importerProfileImg,
                  }
                : value
            )
          );
        }
      } catch (error) {}
    });
  }, [apiLoadingData]);

  const handlePageClick = (currentPage) => {
    // why plus 1 bec react pagination library reads the 1st page with index 0 but in api  is read with index 1
    setPagination((prevValue) => ({
      ...prevValue,
      currentPage: currentPage.selected + 1,
    }));
  };

  // utils function
  let getMonthName = getDate;

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
        show={modalShow.isImporterVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isImporterVerified: false,
          }))
        }
        userType="Factory"
      />

      <FactoryUnVerified
        show={modalShow.isFactoryVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isFactoryVerified: false,
          }))
        }
        // userType="Factory"
      />

      <BecomomeAFactory
        show={modalShow.BecomeAfactory}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            BecomeAfactory: false,
          }))
        }
      />
      <Header title="Sourcing Hub" subTitle="Buyer Requests" />

      <div className="container sourcing-hub-section-pg" id="sourcing-pg">
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              // class="nav-link active"
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
              // class="nav-link text-dark"
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

        {apiLoadingData ? (
          <div className="my-3 py-2 ">
            <div className="loading my-5 ">
              <div className="square-3 "> </div>
            </div>
          </div>
        ) : (
          <div className="row  row-sourcing pt-5">
            <div class="tab-content" id="pills-tabContent">
              <div class=" row">
                {allSourcingReqData?.map((item) => (
                  <div className="col-lg-4 sour-card">
                    <div className="parentsourc justify-content-between">
                      <div className="me-3">
                        <h5 className="sour-2">{item?.productName} </h5>
                        <p className="sourcing horizontal-text-handler ">
                          {item?.productDescription}
                        </p>
                        <p className="mb-1">
                          <span className="fw-bold">Requested by</span>
                          {item?.importerName}
                        </p>
                        {/* <div className="mb-1 d-flex"> */}
                        <p className="mb-1 me-3">
                          <span className="fw-bold">Quantity</span>
                          {item?.quantity}
                        </p>
                        <p className="mb-1">
                          <span className="fw-bold">Deadline</span>
                          {getMonthName(item?.deadline?.split("T")?.[0])}
                        </p>

                        {/* </div> */}
                        <p className="d-flex">
                          <span className="fw-bold pe-1">
                            Sourcing Countries
                          </span>
                          <span className="sourcing horizontal-text-handler-1">
                            {item?.preferredCountries?.length === 0
                              ? "All Countries"
                              : item?.preferredCountries
                                  ?.map((countryitem) => countryitem)
                                  .join(", ")}
                          </span>
                        </p>
                        <div className="d-flex mt-2">
                          {currentUserData?.datacompletelyLoaded ? (
                            <button
                              className="req-btn btn-color me-2 req-btn cursor"
                              type="button"
                            >
                              <i className="fas fa-spinner fa-spin text-white"></i>
                            </button>
                          ) : (
                            <button
                              className="req-btn btn-color me-2 req-btn cursor"
                              onClick={() => {
                                if (currentUserData?.importerId !== null) {
                                  setModalShow((prevVal) => ({
                                    ...prevVal,
                                    isImporterVerified: true,
                                  }));

                                  return;
                                }

                                if (
                                  currentUserData?.factoryId !== null &&
                                  (currentUserData?.factoryVerified === "0" ||
                                    !currentUserData?.factoryEmailActivated)
                                ) {
                                  setModalShow((prevVal) => ({
                                    ...prevVal,
                                    isFactoryVerified: true,
                                  }));

                                  return;
                                } else if (!isLogin) {
                                  setModalShow((prevVal) => ({
                                    ...prevVal,
                                    isLogin: true,
                                  }));

                                  setisLoggedReDirect(
                                    `signIn/answerQuotation?sourcingRequestId=${item.id}&productName=${item?.productName}&userId=${item?.importerId}`
                                  );
                                  return;
                                }

                                if (
                                  currentUserData?.importerId == null &&
                                  currentUserData?.factoryId == null
                                ) {
                                  // ("enteredee", currentUserData);
                                  setModalShow((prevVal) => ({
                                    ...prevVal,
                                    BecomeAfactory: true,
                                  }));

                                  return;
                                } else {
                                  navigate(
                                    `/answerQuotation?sourcingRequestId=${item.id}&productName=${item?.productName}&userId=${item?.importerId}`
                                  );
                                }
                              }}
                            >
                              Send Quote
                            </button>
                          )}

                          <button
                            className="req-btn cursor"
                            type="button"
                            onClick={() => {
                              navigate(
                                `/sourcingBuyerRequest/${item.id}?sourcingRequestId=${item.id}&productName=${item?.productName}&userId=${item?.importerId}`
                              );
                            }}
                          >
                            More Details
                          </button>
                        </div>
                      </div>
                      <div className="img-parent-source-2">
                        <img
                          className="sorcingh-img-2"
                          src={`${baseUrl_IMG}/${item?.docs}`}
                          onError={handleImageError}
                          alt="sourcing request img"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <ReactPaginate
          previousLabel={<i className="fa-solid fa-arrow-left"></i>}
          nextLabel={<i className="fa-solid fa-arrow-right"></i>}
          pageCount={pagination?.totalPage ?? 1} // total number to pages
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          forcePage={0}
          onPageChange={handlePageClick}
          containerClassName="pagination align-items-center justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeClassName="active"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          previousClassName="page-item "
          previousLinkClassName="page-link arrow-link-color margin-prev"
          nextClassName="page-item "
          nextLinkClassName="page-link arrow-link-color margin-next"
          navClassName="pagination-custom"
        />
      </div>
    </>
  );
}

export default Sourcinghub;
