
import {  useState } from "react";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import { useNavigate } from "react-router-dom";
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import DisplayOneImage from "components/Shared/Dashboards/DisplayOneImage";
import ProductDetails from "components/Forms/Shared/SelectedProductDetails";
import { UseOneProduct } from "./UseOneProduct";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";
export default function ProductsFacEtc() {
  let navigate = useNavigate();

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

  let  {
    // isLogin,
    requestedData,
    apiLoadingData,
  } =UseOneProduct()
 
  // utils function

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


      {apiLoadingData?.reqData ?
        <StatusMessagetwo  errorMsg={apiLoadingData?.errorWhileLoading}/>
        :

      <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <ProductDetails productDetails={requestedData} />
                </div>
              </div>

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Product Banners</p>
                  <DisplayMultiImages
                    handleImageClick={handleImageClick}
                    images={requestedData?.images}
                  />
                </div>
              </div>

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Cover Image</p>

                  <DisplayOneImage
                    handleImageClick={handleImageClick}
                    image={requestedData?.coverImage}
                  />
                </div>
              </div>

              <div className="col-12 d-flex justify-content-start btn-modal-gap">
                <button
                  className="btn-edit d-none"
                  type="button"
                  onClick={() => {
                    navigate(
                      `/factorydashboard/editProduct/${requestedData?.id}?productName=${requestedData?.name}`
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
}

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
