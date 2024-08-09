import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";

import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

import { useNavigate, useSearchParams } from "react-router-dom";
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import DisplayOneImage from "components/Shared/Dashboards/DisplayOneImage";
import ProductDetails from "components/Forms/Shared/SelectedProductDetails";
export default function ProductsFacEtc() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);

  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const [apiLoadingData, setapiLoadingData] = useState(true);

  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });
  const handleImageClick = (imagePath) => {
    setShowImagePop({
      display: true,
      imagePath,
    });
  };

  const [PosData, setPosData] = useState();

  async function fetchReqData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/products/${productId}`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        setPosData(response?.data?.products);

        setapiLoadingData(false);
      } else {
        setapiLoadingData(true);
      }
    } catch (error) {
      setapiLoadingData(true);
    }
  }

  useEffect(() => {
    fetchReqData();
  }, [productId]);

  // utils function
  let getMonthName = getDate;

  return (
    <>
      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="Products" />
        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Product Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/factorydashboard/AllFactoryProducts");
                }}
              >
                <p className="cursor"> Products</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <ProductDetails productDetails={PosData} />
                </div>
              </div>

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Product Banners</p>
                  <DisplayMultiImages
                    handleImageClick={handleImageClick}
                    images={PosData?.images}
                  />
                </div>
              </div>

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Cover Image</p>

                  <DisplayOneImage
                    handleImageClick={handleImageClick}
                    image={PosData?.coverImage}
                  />
                </div>
              </div>

              <div className="col-12 d-flex justify-content-start btn-modal-gap">
                <button
                  className="btn-edit d-none"
                  type="button"
                  onClick={() => {
                    navigate(
                      `/factorydashboard/editProduct/${PosData?.id}?productName=${PosData?.name}`
                    );
                  }}
                >
                  <p className="cursor">Edit Product</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MediaPopUp
        show={showImagePop.display}
        onHide={() =>
          setShowImagePop({
            display: false,
            imagePath: "",
          })
        }
        showImagePop={showImagePop.imagePath}
      />
    </>
  );
}
