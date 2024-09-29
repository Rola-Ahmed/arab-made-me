import { useState } from "react";
import MediaPopUp from "components/Shared/MediaPopUp/MediaPopUp";
import { useNavigate } from "react-router-dom";
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import OfferInfo from "components/Shared/Dashboards/Forms/OfferInfo";
import { UseOneOffer } from "./UseOneOffer";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";
import ProductBanner from "components/Shared/Dashboards/ProductBanner";
import { updateSourcingOfferMedia } from "Services/sourcingOffer";
import SuccessToast from "components/SuccessToast";
import ErrorToast from "components/ErrorToast";

export default function OneOffer() {
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
  let {
    isLogin,
    requestedData,
    apiLoadingData,
    setRequestedData,
  } = UseOneOffer();
  const [selectedDocs, setSelectedDocs] = useState([]);

  // add banner
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

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState({
    imagesReadOnly: false,
  });

  async function handleDeleteBanner(index) {
    document.body.style.cursor = "wait";
    const data = await handleSingleFileUpload("images", null, index);
    await handleBannerUploads(data, "delete");
  }
  async function handleBannerUploads(data, actionType) {
    setIsLoading(true);
    const result = await updateSourcingOfferMedia(
      requestedData?.id,
      { Authorization: isLogin },
      data
    );

    console.log("result", result);
    if (result?.success) {
      SuccessToast("data updated succcfully");
      handleClose();
      setRequestedData((prev) => ({
        ...prev,
        ...result?.data?.sourcingOffer,
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

  function handleShow(value) {
    setShow((preValue) => ({
      ...preValue,
      [value]: true,
    }));
  }

  function handleClose() {
    setShow((prevVal) => {
      const newState = { ...prevVal }; // Create a copy of the previous state

      // Iterate through the keys in the state
      Object.keys(newState).forEach((key) => {
        newState[key] = false; // Set each property to false
      });

      return newState; // Return the updated state
    });
    setErrorMsg({});
    setSelectedDocs([]);
  }
  return (
    <>
      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="Offer Details" />

        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Offer Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/factorydashboard/AllFactoryOffers");
                }}
              >
                <p className="cursor"> Offers</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {apiLoadingData?.reqData ? (
        <StatusMessagetwo errorMsg={apiLoadingData?.errorWhileLoading} />
      ) : (
        <div className="section factory-profile m-5">
          <div className="container gap-container px-0">
            <div className=" container-2-gap  p-0">
              <OfferInfo
                requestedData={requestedData}
                handleImageClick={handleImageClick}
                hideImage={true}
              />

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

              <div className="col-12 ">
                <button
                  className="defualt-btn main"
                  type="button"
                  onClick={() => {
                    navigate(
                      `/factorydashboard/editOffer/${requestedData?.id}?productName=${requestedData?.productName}`
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
