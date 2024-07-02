import React, { useEffect, useState, useContext } from "react";
import "./sourcingh.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Carousel from "react-grid-carousel";

import { userDetails } from "Context/userType";
import { baseUrl, baseUrl_IMG } from "config.js";

import UserNotAuthorized from "components/ActionMessages/UserNotAuthorized/UserNotAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerifiedModal/FactoryUnVerifiedModal";
import BecomomeAFactory from "components/ActionMessages/BecomomeAFactory/BecomomeAFactory";

import SourcingOffers from "components/Home/SourcingOffers/SourcingOffers";

import { getMonthName as getDate } from "utils/getMonthName";
import { handleImageError } from "utils/ImgNotFound";

function Sourcingh() {
  let navigate = useNavigate();
  // utils function
  let getMonthName = getDate;
  let { currentUserData } = useContext(userDetails);

  const [allSourcingReqData, setAllSourcingReqData] = useState([]);
  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );
  const [apiLoadingData, setApiLoadingData] = useState(true);

  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 20,

    currentPage: 1,
  }));
  const [modalShow, setModalShow] = useState({
    isFactoryVerified: false,
    isImporterVerified: false,
    BecomeAfactory: false,
  });

  async function fetchSourcingReqData() {
    setApiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/sourcingRequests/?size=${pagination?.displayProductSize}`,
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
      setApiLoadingData(false);
    } catch (error) {
      setApiLoadingData(true);
    }
  }

  useEffect(() => {
    fetchSourcingReqData();
  }, []);

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
                  }
                : value
            )
          );
        }
      } catch (error) {}
    });
  }, [apiLoadingData]);

  return (
    <section className="margin-sm-screen">
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

      <div className="container sourcing-h-hom">
        <h2 className="sourc-h-2">Sourcing Hub</h2>
        <p className="sourc-p pb-2">Buyer Requests</p>
        <div className="row row-home-sourcing ">
          <Carousel
            cols={3}
            rows={1}
            // gap={30}
            scrollSnap={true}
            loop
            showDots={false}
            hideArrow={false}
            responsiveLayout={[
              {
                breakpoint: 1199,
                cols: 2,
                // gap: 58,
              },
              {
                breakpoint: 1199,
                cols: 1,
                // gap: 58,
              },
            ]}
            arrowLeft={
              <div className="arrow-btn position-absolute   arrowLeft carousel">
                <i className="fa-solid fa-chevron-left"></i>
              </div>
            }
            arrowRight={
              <div className="arrow-btn position-absolute arrowRight carousel">
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            }
          >
            {allSourcingReqData?.map((item) => (
              <Carousel.Item>
                {/* <div className="col-lg-4 sour-card"> */}
                <div className="parentsourc  pe-0">
                  <div className="row w-100">
                    <div className="col-9  ">
                      <div className=" ">
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
                      </div>
                    </div>

                    <div className="col-3 pe-0 ">
                      <div className="img-parent-source">
                        <img
                          className="sorcingh-img"
                          src={`${baseUrl_IMG}/${item?.docs}`}
                          onError={handleImageError}
                          alt="sourcing request img"
                        />
                      </div>
                    </div>
                    <div className="col-12 pe-0">
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
                              }

                              if (
                                currentUserData?.importerId == null &&
                                currentUserData?.factoryId == null
                              ) {
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
                          className="req-btn cursor "
                          type="button"
                          onClick={() => {
                            navigate(
                              `/sourcingBuyerRequest/${item?.id}?sourcingRequestId=${item?.id}&productName=${item?.productName}&userId=${item?.importerId}`
                            );
                          }}
                        >
                          More Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <SourcingOffers />
      </div>
    </section>
  );
}

export default Sourcingh;
