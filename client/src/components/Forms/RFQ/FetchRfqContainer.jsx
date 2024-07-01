import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "config.js";

import { useSearchParams } from "react-router-dom";

import Header from "components/main/Header/Header";
import "./RFQ.css";
import RFQ from "./RFQ";
import useAuthFormChecks from "components/Forms/hooks/useAuthFormChecks";

function FetchRfqContainer() {
  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const productId = searchParams.get("productId");
  const factoryName = searchParams.get("factoryName");
  const productName = searchParams.get("productName");

  //
  const [isLoading, setIsLoading] = useState({
    submitLoading: false,
    pageLoading: false,
  });

  let [productDetails, setProductDetails] = useState({});
  let [productDetailsArr, setProductDetailsArr] = useState([]);

  // if there is no specific product slected then call all the products
  //   all products of a specfiic factory
  async function FactoryTotalProductLen() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/products/${factoryId}?include=factory`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setProductDetailsArr(response?.data?.products);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  // product data

  async function fetchProductData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/products/${
          productId !== null && productId
        }?include=factory`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setProductDetails(response.data.products);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (productId !== null) {
      fetchProductData();
    }

    // checks if user is logged in
    // can user access this page
    // if page is loading

    if (productId == "" || productId == null || productId == undefined) {
      // call all total products of the factory
      FactoryTotalProductLen();
    }
  }, [productId, factoryId]);

  const authChecks = useAuthFormChecks(
    isLoading,
    "Send RFQ",
    `sendrfq?factoryId=${factoryId}&factoryName=${factoryName}${
      productId !== null
        ? `&productId=${productId}&productName=${productName}`
        : ""
    }`
  );

  if (authChecks) {
    return authChecks;
  }

  return (
    <>
      <Header title="Send RFQ " />
      {productId ? (
        <RFQ
          productIsSelected={true}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          // new
          factoryData={productDetails?.factory}
          productDetails={productDetails}
          factoryId={factoryId}
          productId={productId}
          productName={productName}
        />
      ) : (
        <RFQ
          productIsSelected={false}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          productDetails={productDetailsArr}
          // new
          factoryData={productDetailsArr?.[0]?.factory}
          factoryId={factoryId}
          productId={productId}
          productName={productName}
        />
      )}
    </>
  );
}

export default FetchRfqContainer;
