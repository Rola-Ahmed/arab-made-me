import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl } from "config.js";
import WhiteLabel from "./PrivateLabel";
// import Loading from "components/Loading/Loading";
import ImporterUnVerifiedFullScreen from "components/ActionMessages/ImporterUnVerifiedFullScreen/ImporterUnVerifiedFullScreen";
import FormValidation from "components/ActionMessages/FormValidation/FormValidation";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg/IsLoggedInMsg";
import { useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import LoadingForm2 from "components/Loading/LoadingForm2";
import Header from "components/main/Header/Header";

export default function PrivateLabelContainerAPI() {
  // State variables

  // State variables
  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("factoryId");
  const productId = searchParams.get("productId");
  // Constants for URL parameters
  const factoryName = searchParams.get("factoryName");
  const productName = searchParams.get("productName");
  const { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [isLoading, setIsLoading] = useState({
    submitLoading: false,
    pageLoading: true,
  });
  const [productDetailsArr, setProductDetailsArr] = useState([]);
  const [productDetails, getProductDetails] = useState({});

  async function fetchProductData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/products/${productId}?include=factory`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setIsLoading((prev) => ({
          ...prev,
          pageLoading: false,
        }));
        getProductDetails(response.data.products);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }
  // all products of a specfiic factory
  async function FactoryTotalProductLen() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/products/${factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setIsLoading((prev) => ({
          ...prev,
          pageLoading: false,
        }));

        setProductDetailsArr(response?.data?.products);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }



  useEffect(() => {
    // gell one product data only
    if (productId !== null) {
      fetchProductData();
    }

    // call all the products if productId is equals null
    if (productId == "" || productId == null || productId == undefined) {
      // call all total products of the factory
      FactoryTotalProductLen();
    }
  }, [productId, factoryId]);

  /*user is not logged in */
  if (!isLogin) {
    return (
      <IsLoggedIn
        show={true}
        distination={`/signIn/whiteLabelings/form?factoryId=${factoryId}&factoryName=${factoryName}${
          productId !== null
            ? `&productId=${productId}&productName=${productName}`
            : ""
        }`}
        bgBlur={"bg-blur"}
      />
    );
  }

  // check user type inorder to access the message
  if (currentUserData && currentUserData?.datacompletelyLoaded == false) {
    if (
      currentUserData?.factoryId !== null &&
      currentUserData?.factoryId !== undefined
    ) {
      return <FormValidation show={true} userType="Buyer" />;
    }

    if (
      currentUserData?.importerId !== null &&
      (currentUserData?.importerVerified === "0" ||
        !currentUserData?.importerEmailActivated)
    ) {
      <ImporterUnVerifiedFullScreen show={true} />;
    }

    if (
      currentUserData?.factoryId == null &&
      currentUserData?.importerId == null
    ) {
      return <FormValidation show={true} userType="Buyer" />;
    }
  }

  /* page is still loading */
  if (isLoading?.pageLoading) {
    return <LoadingForm2 title="Private Label" />;
    // return (
    //   <div className="py-4 my-5 ">
    //     <Loading />
    //   </div>
    // );
  }

  return (
    <>
      <Header title="Private Label" />
      {productId ? (
        <WhiteLabel
          productIsSelected={true}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          // new
          factoryData={productDetails?.factory}
          productDetails={productDetails}
        />
      ) : (
        <WhiteLabel
          productIsSelected={false}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          productDetails={productDetailsArr}
          // new
          factoryData={productDetailsArr?.[0]?.factory}
        />
      )}
    </>
  );

  // // if (productId ==null)
  // return (
  //   <>
  //     <WhiteLabel
  //       productIsSelected={false}
  //       isLoading={isLoading}
  //       setIsLoading={setIsLoading}
  //       productDetails={productDetailsArr}
  //       // new
  //       factoryData={productDetailsArr?.[0]?.factory}
  //     />
  //   </>
  // );
}
