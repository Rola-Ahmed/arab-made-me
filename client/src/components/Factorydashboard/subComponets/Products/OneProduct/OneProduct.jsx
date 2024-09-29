import { useEffect, useState } from "react";
import MediaPopUp from "components/Shared/MediaPopUp/MediaPopUp";
import { useNavigate } from "react-router-dom";
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import ProductDetails from "components/Forms/Shared/SelectedProductDetails";
import { UseOneProduct } from "./UseOneProduct";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";

import { baseUrl_IMG } from "config.js";
import {
  addProductMedia,
  deleteCoverVideo,
  updateProductBanner,
} from "Services/products";
import ErrorToast from "components/ErrorToast";
import SuccessToast from "components/SuccessToast";
import ProductBanner from "components/Shared/Dashboards/ProductBanner";
import CoverImage from "../../../../Shared/Dashboards/CoverImage";
import CoverVideo from "../../../../Shared/CoverVideo";
export default function OneProduct() {
  let navigate = useNavigate();

  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });
  const [selectedDocs, setSelectedDocs] = useState([]);

  const handleImageClick = (imagePath) => {
    setShowImagePop({
      display: true,
      imagePath,
    });
  };
  const [errorMsg, setErrorMsg] = useState();
  const [show, setShow] = useState({
    coverImgReadOnly: false,
    coverVideo: false,
    imagesReadOnly: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  let { isLogin, productDetails, apiLoadingData } = UseOneProduct();
  const [requestedData, setRequestedData] = useState(productDetails);

  useEffect(() => {
    setRequestedData(productDetails);
  }, [productDetails]);

  async function handleSingleFileUpload(fileKeyword, fileValue, index) {
    const formData = new FormData();
    formData.append(fileKeyword, fileValue);
    formData.append("index", index);

    return formData;
  }

  async function handleAddBanner(e, index) {
    document.body.style.cursor = "wait";
    e.preventDefault();
    let data = await handleSingleFileUpload(
      selectedDocs?.[0]?.keyWord,
      selectedDocs?.[0]?.pdfFile,
      index
    );
    await handleBannerUploads(data, "add");
  }

  async function handleDeleteBanner(index) {
    document.body.style.cursor = "wait";
    const data = await handleSingleFileUpload("images", null, index);
    await handleBannerUploads(data, "delete");
  }
  async function handleBannerUploads(data, actionType) {
    setIsLoading(true);
    const result = await updateProductBanner(
      requestedData?.id,
      { Authorization: isLogin },
      data
    );

    if (result?.success) {
      SuccessToast("data updated succcfully");
      handleClose();
      setRequestedData((prev) => ({
        ...prev,
        ...result?.data?.product,
      }));
    } else {
      if (actionType == "delete") {
        ErrorToast("someThing went Wrong");
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: result?.error,
        }));
      }
    }
    setIsLoading(false);
    setTimeout(() => {
      document.body.style.cursor = "default";
    }, 5000); // 5000 milliseconds = 5 seconds
  }
 

  async function updateMeida(e, selectedDocs) {
    e.preventDefault();
    const data = new FormData();

    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

    setIsLoading(true);
    const result = await addProductMedia(
      requestedData?.id,
      { Authorization: isLogin },
      data
    );

    if (result?.success) {
      SuccessToast("data updated succcfully");
      handleClose();
      setRequestedData((prev) => ({
        ...prev,
        ...result?.data?.product,
      }));
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: result?.error,
      }));
    }
    setIsLoading(false);
  }

  function handleClose() {
    ModalClose();
    setErrorMsg({});
    setSelectedDocs([]);
  }

  function handleShow(value) {
    setShow((preValue) => ({
      ...preValue,
      [value]: true,
    }));
  }

  function ModalClose() {
    setShow((prevVal) => {
      const newState = { ...prevVal }; // Create a copy of the previous state

      // Iterate through the keys in the state
      Object.keys(newState).forEach((key) => {
        newState[key] = false; // Set each property to false
      });

      return newState; // Return the updated state
    });
  }
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

      {/* is api loading is true that means error or loading */}
      {apiLoadingData?.reqData ? (
        // error message or loading
        <StatusMessagetwo errorMsg={apiLoadingData?.errorWhileLoading} />
      ) : (
        <div className="section factory-profile m-5">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              <div className="container-profile-input w-100 ">
                <ProductDetails productDetails={requestedData} />
              </div>

              <ProductBanner
                handleImageClick={handleImageClick}
                images={requestedData?.images}
                onAddBanner={handleAddBanner}
                onDeleteBanner={handleDeleteBanner}
                handleShow={handleShow}
                selectedDocs={selectedDocs}
                errorMsg={errorMsg}
                show={show}
                handleClose={handleClose}
                setSelectedDocs={setSelectedDocs}
                setErrorMsg={setErrorMsg}
                isLoading={isLoading}
              />

              <CoverImage
                handleImageClick={handleImageClick}
                handleShow={handleShow}
                coverImage={requestedData?.coverImage}
                show={show}
                handleClose={handleClose}
                errorMsg={errorMsg}
                setSelectedDocs={setSelectedDocs}
                selectedDocs={selectedDocs}
                setErrorMsg={setErrorMsg}
                isLoading={isLoading}
                updateMeida={updateMeida}
              />

              {/* Cover Video  */}
              <CoverVideo
                // handleImageError={handleImageError}
                coverVideo={`${baseUrl_IMG}/${requestedData?.coverVideo}`}
                notEmpty={requestedData?.coverVideo}
                handleShow={handleShow}
                show={show}
                errorMsg={errorMsg}
                handleClose={handleClose}
                isLoading={isLoading}
                updateMedia={updateMeida}
                setErrorMsg={setErrorMsg}
                setSelectedDocs={setSelectedDocs}
                selectedDocs={selectedDocs}
              />


              <div className="col-12 ">
                <button
                  className="defualt-btn main"
                  type="button"
                  onClick={() => {
                    navigate(
                      `/factorydashboard/editProduct/${requestedData?.id}?productName=${requestedData?.name}`
                    );
                  }}
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
