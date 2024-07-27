import { useEffect, useState } from "react";

import Header from "components/main/Header/Header";
import { useNavigate } from "react-router-dom";
import PublicPaginate from "components/Shared/PublicPaginate";
import { getSourcingOffers } from "Services/sourcingOffer";
import SourcingOfferTable from "./SourcingOfferTable";
import Loading from "components/Loading/Loading";

function SourcingOffers() {
  let navigate = useNavigate();

  document.title = "Sourcing Hub";
  const [allSourcingReqData, setAllSourcingReqData] = useState([]);
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

  // utils function

  // "setAllSourcingReqData",allSourcingReqData)

  return (
    <>
      <Header title="Sourcing Hub" />
      <div className="container sourcing-hub-section-pg sourcing-pg">
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              // class="nav-link active"
              className={`btn-sourcing `}
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
              className={`btn-sourcing btn-warning`}
              onClick={() => navigate(`/sourcinghub/sourcingOffers`)}
            >
              Offers
            </button>
          </li>
        </ul>

        <div className="row  row-sourcing pt-5">
          <div className="row">
            <div className="col-12">
              <div className="border-container-2">
                <SourcingOfferTable
                  allSourcingReqData={allSourcingReqData}
                  apiLoadingData={apiLoadingData}
                />

                {allSourcingReqData?.length == 0 && (
                  <div className="d-flex justify-content-center py-5">
                    {apiLoadingData?.errorMsg ? (
                      <p className="fs-5 text-muted fw-bolder text-5 mt-5 pt-5 mx-auto">
                        {apiLoadingData?.errorMsg || "No records Found"}
                      </p>
                    ) : (
                      <div className="d-flex justify-content-center">
                        <Loading />
                      </div>
                    )}
                  </div>
                ) }
              </div>
            </div>
          </div>
        </div>

        <PublicPaginate pagination={pagination} setPagination={setPagination} />
      </div>
    </>
  );
}

export default SourcingOffers;
