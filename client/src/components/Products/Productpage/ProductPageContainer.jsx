import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { baseUrl } from "config.js";
import Productpage from "components/Products/Productpage/Productpage";

export default function ProductPageContainer() {
  let { ProductIdProductNameFactoryName } = useParams();

  const [productData, setProductData] = useState();
  // const [apiLoadingData, setapiLoadingData] = useState(true);

  const [modalShow, setModalShow] = useState({
    isLogin: false,
    isImporterVerified: false,
    isFactoryVerified: false,
  });
  const [isLoggedReDirect, setisLoggedReDirect] = useState("");

  useEffect(() => {
    // setapiLoadingData(true);
    axios
      .get(
        `${baseUrl}/products/${
          ProductIdProductNameFactoryName?.split("-")?.[0]
        }?include=factory`
      )
      .then((response) => {
        if (response?.data?.message === "done") {
          let updatedImages = [];

          if (response.data.products.images != null) {
            updatedImages = [
              ...response.data.products.images,
              response.data.products.coverImage,
            ];
          } else {
            if (response.data.products.coverImage == null) {
              updatedImages = ["updatedImages", "updatedImages"];
            } else {
              updatedImages = [response.data.products.coverImage];
            }
          }

          setProductData({
            ...response.data.products,
            productSlider: updatedImages,
          });
          // setapiLoadingData(false);
        }
      })
      .catch((error) => {
        // setapiLoadingData(true);
      });
  }, [ProductIdProductNameFactoryName]);

  return (
    <Productpage
      productData={productData}
      modalShow={modalShow}
      setisLoggedReDirect={setisLoggedReDirect}
      setModalShow={setModalShow}
      isLoggedReDirect={isLoggedReDirect}
    />
  );
}
