// import "./sourcingh.css";
import { useNavigate } from "react-router-dom";
import "./SourcingOffers.css";
import { handleImageError } from "utils/ImgNotFound";

import React, { useEffect, useState } from "react";

import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";
import { getMonthName as getDate } from "utils/getMonthName";

export default function SourcingOffers() {
  let navigate = useNavigate();
  // utils function
  let getMonthName = getDate;

  const [allSourcingReqData, setAllSourcingReqData] = useState([]);
  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );
  const [apiLoadingData, setapiLoadingData] = useState(true);

  const [pagination, setPagination] = useState(() => ({
    // i want to display 3 pdoructs in the 1st page
    displayProductSize: 100,
    //
    currentPage: 1,
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

  return (
    <>
      {/* // <section> */}

      <p className="sourc-p pb-2">Factory Offers</p>
      <div className="row">
        <div className="col-12">
          <div className="border-container">
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
                      <p className="title-3 text-muted">Exporting Countries</p>
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
                  <tr
                    className="cursor"
                    onClick={() => {
                      navigate(
                        `/sourcingOffer/${item?.id}?factoryOffersId=${item?.id}&productName=${item?.productName}&factoryId=${item?.factoryId}`
                      );
                    }}
                  >
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
                                  Array.isArray(item) ? item.join(", ") : item
                                ) || []
                              ).join(", ")
                            : "All"}
                        </p>
                      </div>
                    </td>

                    <td className="">
                      <div className="d-flex  align-items-center ">
                        <p className="title-2">{item?.productDescription}</p>
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
      <div className="btn-container-all cursor">
        <div
          className="get-all-btn text-decoration-none text-white cursor"
          onClick={() => {
            navigate("/sourcinghub/SourcingRequests");
          }}
        >
          Sourcing Hub
        </div>
      </div>
     
    </>
  );
}
