import { useState, useContext, useEffect } from "react";

import { useSearchParams, useParams } from "react-router-dom";
import { fetchFactoryProducts } from "Services/factory";
import { fetchProductData } from "Services/products";
import { getOnePO } from "Services/PO";
import PurchasingOrder from "./PurchasingOrder";

function FetchPurchasingOrder() {
  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const productId = searchParams.get("productId");
  const sourcingOfferId = searchParams.get("sourcingOfferId");
  const factoryName = searchParams.get("factoryName");
  const productName = searchParams.get("productName");
  let { requestType } = useParams();

  const normalizedRequestType = requestType?.toLowerCase();
  let requestTypeValues = {
    fromFactory: "fromfactory",
    fromSelectedProduct: "fromselectedproduct",
    fromSourcingReuqest: "fromsourcingreuqest",
    fromQuotation: "fromquotation",
  };

  const [isLoading, setIsLoading] = useState({
    submitLoading: false,
    pageLoading: true,
    errorPageLoading: true, //msg
  });

  // if a sepcific prouct is selected
  let [productDetails, setProductDetails] = useState({});

  // if no product is selected
  let [productDetailsArr, setProductDetailsArr] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let result;
      try {
        if (normalizedRequestType == requestTypeValues.fromFactory) {
          result = await fetchFactoryProducts(factoryId);
        } else if (
          normalizedRequestType == requestTypeValues.fromSelectedProduct
        ) {
          result = await fetchProductData(productId);
        } else if (
          normalizedRequestType == requestTypeValues.fromSourcingReuqest
        ) {
          result = await getOnePO(sourcingOfferId);
        }

        if (result && result?.success) {
          if (normalizedRequestType == requestTypeValues.fromFactory) {
            setProductDetailsArr(result.data.products);
          } else {
            setProductDetails(result.data.products);
          }
        }

        setIsLoading((prev) => ({
          ...prev,
          pageLoading: result?.loadingStatus,
          errorPageLoading: result?.error,
        }));
      } catch (error) {}
    };

    fetchData();
  }, [productId, factoryId, requestType]);

  //
  if (normalizedRequestType == requestTypeValues.fromSelectedProduct) {
    return (
      <PurchasingOrder
        productIsSelected={true}
        SourcingIsSelected={false}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        factoryData={productDetails?.factory} //not array
        productDetails={productDetails} //not array
        productName={productName}
        productId={productId}
        factoryId={factoryId}
        requestType={normalizedRequestType}
        requestTypeValues={requestTypeValues}
        // sourcingOfferId={sourcingOfferId}
        // sourcingData={productDetails}
      />
    );
  } else if (normalizedRequestType == requestTypeValues.fromSourcingReuqest) {
    return (
      <PurchasingOrder
        productIsSelected={true}
        SourcingIsSelected={true}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        factoryData={productDetails?.factory} //not array
        productDetails={productDetails?.product} //not array
        productName={productName}
        productId={productId}
        factoryId={factoryId}
        sourcingOfferId={sourcingOfferId}
        sourcingData={productDetails}
        requestType={normalizedRequestType}
        requestTypeValues={requestTypeValues}
      />
    );
  } else {
    return (
      <PurchasingOrder
        productIsSelected={false}
        SourcingIsSelected={false}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        productDetails={productDetailsArr}
        // new
        factoryData={productDetailsArr?.[0]?.factory}
        productName={productName}
        productId={productId}
        factoryId={factoryId}
        requestType={normalizedRequestType}
        requestTypeValues={requestTypeValues}
      />
    );
  }
}

export default FetchPurchasingOrder;
