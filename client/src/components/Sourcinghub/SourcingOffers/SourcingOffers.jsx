import { useEffect, useState } from "react";

import Header from "components/main/Header/Header";
import { getMonthName as getDate } from "utils/getMonthName";

import { handleImageError } from "utils/ImgNotFound";

import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import { useNavigate } from "react-router-dom";
import PublicPaginate from "components/Shared/PublicPaginate";

function SourcingOffers() {
  let navigate = useNavigate();

  document.title = "Sourcing Hub";

  const [allSourcingReqData, setAllSourcingReqData] = useState([]);
  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );
  const [apiLoadingData, setapiLoadingData] = useState(true);

  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 600,

    currentPage: 1,
    // totalPage: Math.ceil((allProductsData?.length) /pagination.displayProductSize), // Use 30 as the default display size
  }));

  async function fetchSourcingReqData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/sourcingOffers/?size=${pagination?.displayProductSize}&page=${pagination?.currentPage}`,
      };

      const response = await axios.request(config);
      setAllSourcingReqData(response.data?.sourcingoffers);
      const uniqueIds = [
        ...new Set(
          response.data?.sourcingoffers
            .map((obj) => obj.factoryId) // Extract all factoryIds
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
          `${baseUrl}/sourcingOffers`
        );

        if (response1.data.message === "done") {
          setPagination((prevValue) => ({
            ...prevValue,
            totalPage: Math.ceil(
              (response1.data.sourcingoffers?.length || 0) /
                prevValue.displayProductSize
            ),
          }));
        }
      } catch (error) {}
    };

    fetchDataLenght();
    // }, [filter]);
  }, [pagination?.currentPage]);

  useEffect(() => {
    // Promise.all(
    uniqueFactoryIDofProducts.map(async (factoryID) => {
      try {
        const productResponse = await axios.get(
          `${baseUrl}/factories/${factoryID}`
        );

        if (productResponse.data.message === "done") {
          setAllSourcingReqData((prevData) =>
            prevData.map((value) =>
              value?.factoryId === factoryID
                ? {
                    ...value,
                    country: productResponse?.data?.factories?.country,
                  }
                : value
            )
          );
        }
      } catch (error) {}
    });
  }, [apiLoadingData]);

  // utils function
  let getMonthName = getDate;
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
                <table class="table table-striped align-middle ">
                  <thead>
                    <tr className=" bg-header">
                      <th scope="col" className="">
                        <div className="d-flex  align-items-center justify-contnet-center ">
                          <p className="title-3 text-muted">Product</p>
                        </div>
                      </th>
                      <th scope="col">
                        <div className="d-flex  align-items-center justify-contnet-center ">
                          <p className="title-3 text-muted">Quantity</p>
                        </div>
                      </th>
                      <th scope="col">
                        <div className="d-flex  align-items-center justify-contnet-center ">
                          <p className="title-3 text-muted">
                            Exporting Countries
                          </p>
                        </div>
                      </th>
                      <th scope="col">
                        <div className="d-flex  align-items-center justify-contnet-center ">
                          <p className="title-3 text-muted">Details</p>
                        </div>
                      </th>
                      <th scope="col" className="">
                        <div className="d-flex  align-items-center justify-contnet-center ">
                          <p className="title-3 text-muted">Date</p>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSourcingReqData?.map((item) => (
                      <tr className="cursor">
                        <th className="  " scope="row">
                          <div className="d-flex flag-container align-items-center">
                            <img
                              className="flag-img"
                              src={`${baseUrl_IMG}/${item?.docs}`}
                              onError={handleImageError}
                            />
                            <p className="title">{item?.productName}</p>
                          </div>
                        </th>
                        <td className="">
                          <div className="d-flex  align-items-center ">
                            <p className="title-2">{item?.quantity}</p>
                          </div>
                        </td>
                        <td className="">
                          <div className="d-flex  align-items-center ">
                            <p className="title-2">
                              {item?.preferredCountries?.length !== 0
                                ? (
                                    item?.preferredCountries?.map((item) =>
                                      Array.isArray(item)
                                        ? item.join(", ")
                                        : item
                                    ) || []
                                  ).join(", ")
                                : "All"}
                            </p>
                          </div>
                        </td>

                        <td className="">
                          <div className="d-flex  align-items-center ">
                            <p className="title-2">
                              {item?.productDescription}
                            </p>
                          </div>
                        </td>
                        <td className="">
                          <p className="title">
                            {getMonthName(item?.createdAt?.split("T")?.[0])}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
