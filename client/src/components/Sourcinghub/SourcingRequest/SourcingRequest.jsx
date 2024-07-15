import { useEffect, useState, useContext } from "react";

import Header from "components/main/Header/Header";
import { userDetails } from "Context/userType";

import "../source.css";

import axios from "axios";
import { baseUrl } from "config.js";
import { UserToken } from "Context/userToken";
import { useNavigate } from "react-router-dom";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import BecomomeAFactory from "components/ActionMessages/BecomeAFactory/BecomeAFactory";
import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";
import SourcingRequestCard from "./SourcingRequestCard";
import PublicPaginate from "components/Shared/PublicPaginate";
function Sourcinghub() {
  document.title = "Sourcing Hub";
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);
  let navigate = useNavigate();

  const [allSourcingReqData, setAllSourcingReqData] = useState([]);
  // const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );
  const [apiLoadingData, setapiLoadingData] = useState(true);

  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 8,
    currentPage: 1,
    totalPage: 1,
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
        distination={`/sigin`}
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
      <Header title="Sourcing Hub" />

      <div
        className="container sourcing-hub-section-pg sourcing-pg"
        id="sourcing-pg"
      >
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
          </div>
        )}

        <PublicPaginate pagination={pagination} setPagination={setPagination} />
      </div>
    </>
  );
}

export default Sourcinghub;
