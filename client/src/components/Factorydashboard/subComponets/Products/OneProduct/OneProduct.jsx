import { useEffect, useState } from "react";
import MediaPopUp from "components/Shared/MediaPopUp/MediaPopUp";
import { useNavigate } from "react-router-dom";
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import DisplayOneImage from "components/Shared/Dashboards/DisplayOneImage";
import ProductDetails from "components/Forms/Shared/SelectedProductDetails";
import { UseOneProduct } from "./UseOneProduct";
import StatusMessagetwo from "components/Shared/Dashboards/StatusMessagetwo";
import UploadDocument, {
  UploadVedio,
} from "components/Forms/Shared/UploadDocument";
import { baseUrl_IMG } from "config.js";
import Modal from "react-bootstrap/Modal";
import {
  addProductMedia,
  deleteCoverVideo,
  updateProductBanner,
} from "Services/products";
import ErrorToast from "components/ErrorToast";
import SuccessToast from "components/SuccessToast";
import ProductBanner from "./subComonents/ProductBanner";
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
  console.log("productDetails", productDetails);

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
  async function deleteMedia(keyword) {
    setTimeout(() => {
      document.body.style.cursor = "wait";
    }, 5000); // 5000 milliseconds = 5 seconds
    const data = new FormData();
    data.append([keyword], "");
    const result = await deleteCoverVideo(
      requestedData?.id,
      { Authorization: isLogin }
      // data
    );

    if (result?.success) {
      SuccessToast("data updated succcfully");
      setRequestedData((prev) => ({
        ...prev,
        ...result?.data?.product,
      }));
    } else {
      ErrorToast("someThing went Wrong");
    }
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

              <div className="container-profile-input w-100  gap-16">
                <p className="fs-24-semi"> Cover Image</p>
                <DisplayOneImage
                  handleImageClick={handleImageClick}
                  image={requestedData?.coverImage}
                />
                <button
                  className="btn-edit w-fit-content"
                  onClick={() => handleShow("coverImgReadOnly")}
                >
                  <p className="cursor">Upload </p>
                </button>
              </div>

              <div className="container-profile-input w-100 gap-16 ">
                <p className="fs-24-semi">Cover Video</p>
                {/* ----------------------- */}
                <div className="row row-gap-15 w-100">
                  <div className="col-12 h-fit-content position-relative">
                    {requestedData?.coverVideo ? (
                      <>
                        <video
                          controls="controls"
                          autoPlay={false}
                          muted={true}
                          className="h-75 w-100"
                          src={`${baseUrl_IMG}/${requestedData?.coverVideo}`}
                          alt="Cover Video"
                          // onError={handleImageError}
                          style={{ maxHeight: "55vh" }}
                        />
                        <button
                          className="position-absolute delete-img   bg-white rounded-3  border-1 border-danger "
                          type="button"
                          onClick={() => {
                            deleteMedia("coverVideo");
                          }}
                        >
                          <i class="fa-solid fa-trash  text-danger cursor"></i>
                        </button>
                      </>
                    ) : (
                      <h5 className="text-muted text-center py-3">Empty</h5>
                    )}
                  </div>

                  <div className="col-12">
                    <button
                      className="btn-edit fs-15 fw-600 text-white"
                      onClick={() => handleShow("coverVedioReadOnly")}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>

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

      {/* cover Vedio */}
      <Modal
        show={show.coverVedioReadOnly}
        onHide={() => handleClose("coverVedioReadOnly")}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          {/* Account Info container 1 */}

          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Cover Video</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response ? (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              ) : (
                ""
              )}
              <div className="w-100 ">
                <form
                  onSubmit={(e) => updateMeida(e, selectedDocs)}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <UploadVedio
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="coverVideo"
                      mediaMaxLen="1"
                      meidaAcceptedExtensions={["mp4", "mkv", "x-matroska"]}
                      setErrorMsg={setErrorMsg}
                      // title="Certificates"
                    />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => handleClose("coverVideo")}
                      >
                        Close
                      </button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white px-5"></i>
                        </button>
                      ) : (
                        <button
                          className="btn-edit submitButton"
                          type="submit"
                          disabled={!(selectedDocs?.length > 0)}
                        >
                          <p className="cursor">Submit Video</p>
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Cover Image */}
      <Modal
        show={show.coverImgReadOnly}
        onHide={() => handleClose("coverImgReadOnly")}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          {/* Account Info container 1 */}

          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>product cover Image</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              )}
              <div className="w-100 ">
                <form
                  onSubmit={(e) => updateMeida(e, selectedDocs)}
                  encType="multipart/form-data"
                >
                  <div className="row  row-gap">
                    <UploadDocument
                      selectedDocs={selectedDocs}
                      errorMsg={errorMsg}
                      setSelectedDocs={setSelectedDocs}
                      MediaName="coverImage"
                      mediaMaxLen="1"
                      meidaAcceptedExtensions={["png", "jpeg", "jpg"]}
                      setErrorMsg={setErrorMsg}
                      // title="Factory Banners"
                    />

                    <div className="col-12 d-flex justify-content-start btn-modal-gap">
                      <button
                        type="button"
                        onClick={() => handleClose("coverImgReadOnly")}
                        className="btn btn-secondary"
                      >
                        Close
                      </button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white px-5"></i>
                        </button>
                      ) : (
                        <button
                          className="btn-edit submitButton"
                          type="submit"
                          disabled={!(selectedDocs?.length > 0)}
                        >
                          <p className="cursor">Submit</p>
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>


      
    </>
  );
}
