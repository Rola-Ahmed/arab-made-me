import { useState, useEffect } from "react";

import { useSearchParams } from "react-router-dom";

import Header from "components/main/Header/Header";
import "./RFQ.css";
import RFQ from "./RFQ";
import useAuthFormChecks from "components/Forms/hooks/useAuthFormChecks";
import { fetchFactoryProducts } from "Services/factory";
import { fetchProductData } from "Services/products";
function FetchRfqContainer() {
  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const productId = searchParams.get("productId");
  const factoryName = searchParams.get("factoryName");
  const productName = searchParams.get("productName");

  //
  const [isLoading, setIsLoading] = useState({
    submitLoading: false,
    pageLoading: true,
    errorPageLoading: true,
  });

  let [productDetailsArr, setProductDetailsArr] = useState([]);
  let [productDetails, setProductDetails] = useState({});

  // if there is no specific product slected then call all the products
  //   all products of a specfiic factory

  // product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        let result;
        if (productId) {
          result = await fetchProductData(productId);
        } else if (!productId) {
          result = await fetchFactoryProducts(factoryId);
        }

        // if there is error
        if (result?.success) {
          //  state is success
          if (result.data.message == "done") {
            if (productId) {
              setProductDetails(result.data.products);
            } else {
              setProductDetailsArr(result.data.products);
            }
          }
        }
        setIsLoading((prev) => ({
          ...prev,
          pageLoading: result.loadingStatus,
          errorPageLoading: result.error,
        }));
      } catch (error) {}
    };

    fetchData();
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
