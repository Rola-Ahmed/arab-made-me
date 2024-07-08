import React, { useState, useContext, useEffect } from "react";

import {
  pdfIcon,
  awaitImg,
  nextImg,
  currentsubPoint,
  checkedImg,
} from "constants/Images";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";


function CompanyMircoSiteDocs() {
  let { isLogin } = useContext(UserToken);

  document.title = "Company Registration";

  useEffect(() => {
    if (!isLogin) {
      navigate(`/signIn/CompanyDetails/MircoSiteDocs`);
    }

    // }
  }, [isLogin]);

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState();

  const [isLoading, setIsLoading] = useState("");

  // ------------------------------------------------new
  async function UploadDocs(e) {
    setIsLoading(true);

    e.preventDefault();

    const FormData = require("form-data");
    let data = new FormData();

    selectedDocs?.map((item) => data.append(item.keyWord, item.pdfFile));

    let config = {
      method: "put",
      url: `${baseUrl}/factories/media`,

      headers: {
        authorization: isLogin,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.message == "done") {
          setIsLoading(true);
          navigate(`/CompanyDetails/RepresentiveDetails`);
        } else {
          setIsLoading(false);
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            response: response?.data?.message,
          }));
          const targetElement = document.getElementById("view");
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response) {
          const statusCode = error.response.status;
          switch (statusCode) {
            case 400:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response: error?.response?.data?.errorMessage,
              }));
              break;
            case 401:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response: "User is not Unauthorized ",
              }));
              break;
            case 403:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response:
                  "Forbidden, You do not have permission to access this resource.",
              }));
              break;
            case 404:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response:
                  "Not Found (404). The requested resource was not found.",
              }));
              break;

            case 500:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response: error?.response?.data?.errorMessage,
              }));
              break;

            //  429 Too Many Requests
            // The user has sent too many requests in a given amount of time ("rate limiting").
            case 429:
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response: " Too Many Requests , Please try again later.",
              }));
              break;
            case 402:
              // 402
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response: error?.response?.data?.message,
              }));
              break;
            default:
              // case message== error
              setErrorMsg((prevErrors) => ({
                ...prevErrors,
                response: error?.response?.data?.errorMessage,
              }));
              break;
          }
        } else {
          setErrorMsg((prevErrors) => ({
            ...prevErrors,
            response: "An unexpected error occurred. Please try again later.",
          }));
        }

        const targetElement = document.getElementById("view");
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
  }

  const [selectedDocs, setSelectedDocs] = useState([
    // {
    //   keyWord: null,
    //   pdfFile: null,
    // },
  ]);

  function removeSelectedDoc(docId, keyWordDoc, index) {
    let updatedDocs = [...selectedDocs];
    updatedDocs.splice(index, 1);

    setSelectedDocs(updatedDocs);
  }

  function handleMultiMediaValidation(e, keyWordDoc) {
    const count = selectedDocs?.filter(
      (item) => item?.keyWord === "docs"
    )?.length;

    if (count >= 3) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: `Max length is 3`,
      }));
      return;
    }
    // clear error message
    setErrorMsg((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[keyWordDoc];
      return newErrors;
    });
    // const acceptedExtensions = ["pdf", "png", "jpeg", "jpg"];

    let acceptedExtensions = [];

    if (keyWordDoc == "legalDocs" || keyWordDoc == "qualityCertificates") {
      acceptedExtensions = ["pdf", "png", "jpeg", "jpg"];
    } else if (keyWordDoc == "images" || keyWordDoc == "coverImage") {
      acceptedExtensions = ["png", "jpeg", "jpg"];
    } else if (keyWordDoc == "coverVideo") {
      acceptedExtensions = ["mp4", "mkv"];
    }

    const fileType = e.type;

    const isAcceptedType = acceptedExtensions?.some((extension) =>
      fileType?.toLowerCase()?.includes(extension?.toLowerCase())
    );

    if (!isAcceptedType) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]:
          // "Invalid file format. Only pdf, png, jpeg, jpg, mp4 allowed"
          `Invalid file format. Only ${acceptedExtensions.join(
            ", "
          )} are allowed`,
      }));
      return;
    }

    const mediaNameExists = selectedDocs?.some(
      (item) => item?.pdfFile?.name === e?.name && item?.keyWord === keyWordDoc
    );

    // if image aleady exisit
    if (mediaNameExists) {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: "Media already exists",
      }));
      return;
    } else {
    }

    let updatedDocs = [...selectedDocs];

    // Image loaded successfully
    const reader = new FileReader();
    reader.onloadend = () => {
      updatedDocs.push({
        keyWord: keyWordDoc,
        pdfFile: e,
        imageReaderURL: reader.result,
        onprogress: 100,
      });

      setSelectedDocs(updatedDocs);
      const imagesInput = document?.getElementById("imagesInput");
      if (imagesInput) {
        imagesInput.value = "";
      }

      const coverImageInput = document?.getElementById("coverImageInput");
      if (coverImageInput) {
        coverImageInput.value = "";
      }

      const qualityCertificatesInput = document?.getElementById(
        "qualityCertificatesInput"
      );
      if (qualityCertificatesInput) {
        qualityCertificatesInput.value = "";
      }

      const coverVideo = document?.getElementById("coverVideo");
      if (coverVideo) {
        coverVideo.value = "";
      }
    };

    reader.onprogress = (event) => {
      // Calculate and show the loading percentage
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;

        // if (updatedDocs.length > 0) {
        //   // Adding a new attribute to the last object
        //   // updatedDocs[updatedDocs.length - 1].onprogress = percentage?.toFixed(0);
        //   // setSelectedDocs([...updatedDocs]);

        //   // setSelectedDocs((prevDocs) => {
        //   //   const updatedDocs = [...prevDocs];
        //   //   if (updatedDocs.length > 0) {
        //   //     updatedDocs[updatedDocs.length - 1].onprogress = percentage?.toFixed(0);
        //   //   }
        //   //   return updatedDocs;
        //   // });
        // }
        // setimgloadin(percentage);
      }
    };

    reader.onerror = () => {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        [keyWordDoc]: "Error loading image",
      }));
    };

    reader.readAsDataURL(e);
  }

  return (
    <>
      <section id="view" className="register-msg ">
        {/* <div className="container "> */}
        <div className=" container ">
          <div className=" cont-1 d-flex justify-content-center align-items-center mx-auto  ">
            <div className=" sub-cont w-100">
              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="img-cont ms-5">
                    <img src={checkedImg} alt="" />
                  </div>

                  <div className="w-100 vertical-line  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont  ">Select Your Role</p>
              </div>

              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line mt-auto mb-auto"></div>
                  <div className="img-cont">
                    <img src={awaitImg} alt="" />
                  </div>

                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>
                  <div className="img-cont d-flex align-items-center ">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>

                  <div className="img-cont  d-flex align-items-center">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-25 vertical-line  mt-auto mb-auto"></div>

                  <div className="img-cont  d-flex align-items-center">
                    <img src={currentsubPoint} alt="" />
                  </div>
                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont text-center">
                  Company Microsite Details
                </p>
              </div>

              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                  <div className="img-cont">
                    <img src={nextImg} alt="" />
                  </div>

                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                </div>
                <p className="text-cont text-center">
                  Representive Information
                </p>
              </div>

              <div className=" text-check ">
                <div className="  timeline-reg d-flex">
                  <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                  <div className="img-cont me-5">
                    <img src={nextImg} alt="" />
                  </div>
                </div>
                <p className="text-cont text-end">Legal Documents</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => UploadDocs(e)}
            className="header w-100"
            encType="multipart/form-data"
          >
            <div className="sec-div d-flex justify-content-center">
              <div className="frame-container-2 ">
                <div className="cont-frame-1 ">
                  {errorMsg?.response && (
                    <p className="text-sub m-auto alert  alert-danger  text-dark w-100">
                      {errorMsg.response}
                    </p>
                  )}

                  <div className="row gap-row-2">
                    {/* factory cover Images */}

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">Company Banners </label>
                        <label
                          className="mb-0 drop-drag-area  p-5 text-center cursor w-100 "
                          htmlFor="imagesInput"
                          onDrop={(e) => {
                            e.preventDefault();
                            const files = e?.dataTransfer?.files;
                            if (files && files.length > 0) {
                              handleMultiMediaValidation(files?.[0], "images");
                            }

                            e.target.classList.remove("highlight");
                          }}
                          onDragOver={(e) => {
                            e.target.classList.add("highlight");

                            e.preventDefault();
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.target.classList.remove("highlight");
                          }}
                          onChange={(e) => {
                            const files = e.target.files;

                            if (files && files?.length > 0) {
                              handleMultiMediaValidation(files?.[0], "images");
                            }
                          }}
                        >
                          Drag and drop files here or click to select files
                          <input
                            type="file"
                            id="imagesInput"
                            // className="d-none"
                            hidden
                            onChange={(e) => {
                              const files = e.target.files;

                              if (files && files?.length > 0) {
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "images"
                                );
                              }
                            }}
                            multiple
                          />
                        </label>
                        <small className="form-text small-note">
                          Only png, jpeg, and jpg are allowed. A maximum of 8
                          pictures is permitted.
                        </small>

                        <small className="text-danger">
                          {errorMsg?.images}
                        </small>

                        {/* <div className=" row w-100 "> */}
                        {selectedDocs.map(
                          (item, index) =>
                            // <div className="col-12">
                            item.keyWord === "images" && (
                              <div key={index} className="col-12 img-uploaded">
                                <div className="d-flex justify-content-between align-items-center  img-cont-file">
                                  {/* <div> */}

                                  <div className="d-flex justify-content-start align-items-center ">
                                    <img
                                      // src={item.imageReaderURL}
                                      src={
                                        item?.pdfFile?.name?.includes("pdf")
                                          ? pdfIcon
                                          : item.imageReaderURL
                                      }
                                      className="image-upload-file me-3"
                                    />
                                  </div>

                                  <div className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div>
                                        <p className="img-text">
                                          {item?.pdfFile?.name}
                                        </p>
                                        <p className="">
                                          {(
                                            item?.pdfFile?.size / 1024
                                          )?.toFixed(2)}
                                          KB
                                        </p>
                                        {/* {imgloadin} */}
                                      </div>

                                      <div
                                        onClick={() =>
                                          removeSelectedDoc(
                                            item?.pdfFile?.name,
                                            "docs",
                                            index
                                          )
                                        }
                                        className="cursor"
                                      >
                                        <i className="fa-solid fa-trash-can"></i>
                                      </div>
                                    </div>

                                    <div className="d-flex  align-items-center">
                                      <progress
                                        className="w-100"
                                        id="progressBar"
                                        max="100"
                                        value={item?.onprogress || 0}
                                        // value="30"
                                        imgloadin
                                      ></progress>
                                      {item?.onprogress}%
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          // </div>
                        )}
                      </div>
                    </div>

                    {/* factory profileeee */}

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">Companylogo </label>
                        <label
                          className="mb-0 drop-drag-area  p-5 text-center cursor w-100 "
                          htmlFor="coverImageInput"
                          onDrop={(e) => {
                            e.preventDefault();
                            const files = e?.dataTransfer?.files;
                            if (files && files.length > 0) {
                              handleMultiMediaValidation(
                                files?.[0],
                                "coverImage"
                              );
                            }

                            e.target.classList.remove("highlight");
                          }}
                          onDragOver={(e) => {
                            e.target.classList.add("highlight");

                            e.preventDefault();
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.target.classList.remove("highlight");
                          }}
                          onChange={(e) => {
                            const files = e.target.files;

                            if (files && files?.length > 0) {
                              handleMultiMediaValidation(
                                files?.[0],
                                "coverImage"
                              );
                            }
                          }}
                        >
                          Drag and drop files here or click to select files
                          <input
                            type="file"
                            id="coverImageInput"
                            // className="d-none"
                            hidden
                            onChange={(e) => {
                              const files = e.target.files;

                              if (files && files?.length > 0) {
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "coverImage"
                                );
                              }
                            }}
                            multiple
                          />
                        </label>
                        <small className="form-text small-note">
                          Only PNG, JPEG, and JPG are allowed. A maximum of 1
                          pictures is permitted.
                        </small>

                        <small className="text-danger">
                          {errorMsg?.coverImage}
                        </small>

                        {/* <div className=" row w-100 "> */}
                        {selectedDocs.map(
                          (item, index) =>
                            // <div className="col-12">
                            item.keyWord === "coverImage" && (
                              <div key={index} className="col-12 img-uploaded">
                                <div className="d-flex justify-content-between align-items-center  img-cont-file">
                                  {/* <div> */}

                                  <div className="d-flex justify-content-start align-items-center ">
                                    <img
                                      // src={item.imageReaderURL}
                                      src={
                                        item?.pdfFile?.name?.includes("pdf")
                                          ? pdfIcon
                                          : item.imageReaderURL
                                      }
                                      className="image-upload-file me-3"
                                    />
                                  </div>

                                  <div className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div>
                                        <p>{item?.pdfFile?.name}</p>
                                        <p className="">
                                          {(
                                            item?.pdfFile?.size / 1024
                                          )?.toFixed(2)}
                                          KB
                                        </p>
                                        {/* {imgloadin} */}
                                      </div>

                                      <div
                                        onClick={() =>
                                          removeSelectedDoc(
                                            item?.pdfFile?.name,
                                            "coverImage",
                                            index
                                          )
                                        }
                                        className="cursor"
                                      >
                                        <i className="fa-solid fa-trash-can"></i>
                                      </div>
                                    </div>

                                    <div className="d-flex  align-items-center">
                                      <progress
                                        className="w-100"
                                        id="progressBar"
                                        max="100"
                                        value={item?.onprogress || 0}
                                        // value="30"
                                        imgloadin
                                      ></progress>
                                      {item?.onprogress}%
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          // </div>
                        )}
                      </div>
                    </div>

                    {/* cetifactessssss */}

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">Certificates </label>
                        <label
                          className="mb-0 drop-drag-area  p-5 text-center cursor w-100 "
                          htmlFor="qualityCertificatesInput"
                          onDrop={(e) => {
                            e.preventDefault();
                            const files = e?.dataTransfer?.files;
                            if (files && files.length > 0) {
                              handleMultiMediaValidation(
                                files?.[0],
                                "qualityCertificates"
                              );
                            }

                            e.target.classList.remove("highlight");
                          }}
                          onDragOver={(e) => {
                            e.target.classList.add("highlight");

                            e.preventDefault();
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.target.classList.remove("highlight");
                          }}
                          onChange={(e) => {
                            const files = e.target.files;

                            if (files && files?.length > 0) {
                              handleMultiMediaValidation(
                                files?.[0],
                                "qualityCertificates"
                              );
                            }
                          }}
                        >
                          Drag and drop files here or click to select files
                          <input
                            type="file"
                            id="qualityCertificatesInput"
                            // className="d-none"
                            hidden
                            onChange={(e) => {
                              const files = e.target.files;

                              if (files && files?.length > 0) {
                                handleMultiMediaValidation(
                                  files?.[0],
                                  "qualityCertificates"
                                );
                              }
                            }}
                            multiple
                          />
                        </label>
                        <small className="form-text small-note">
                          Only PDF ,PNG, JPEG, and JPG are allowed. A maximum of
                          3 pictures is permitted.
                        </small>

                        <small className="text-danger">
                          {errorMsg?.qualityCertificates}
                        </small>

                        {/* <div className=" row w-100 "> */}
                        {selectedDocs.map(
                          (item, index) =>
                            // <div className="col-12">
                            item.keyWord === "qualityCertificates" && (
                              <div key={index} className="col-12 img-uploaded">
                                <div className="d-flex justify-content-between align-items-center  img-cont-file">
                                  {/* <div> */}

                                  <div className="d-flex justify-content-start align-items-center ">
                                    <img
                                      // src={item.imageReaderURL}
                                      src={
                                        item?.pdfFile?.name?.includes("pdf")
                                          ? pdfIcon
                                          : item.imageReaderURL
                                      }
                                      className="image-upload-file me-3"
                                    />
                                  </div>

                                  <div className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div>
                                        <p>{item?.pdfFile?.name}</p>
                                        <p className="">
                                          {(
                                            item?.pdfFile?.size / 1024
                                          )?.toFixed(2)}
                                          KB
                                        </p>
                                        {/* {imgloadin} */}
                                      </div>

                                      <div
                                        onClick={() =>
                                          removeSelectedDoc(
                                            item?.pdfFile?.name,
                                            "qualityCertificates",
                                            index
                                          )
                                        }
                                        className="cursor"
                                      >
                                        <i className="fa-solid fa-trash-can"></i>
                                      </div>
                                    </div>

                                    <div className="d-flex  align-items-center">
                                      <progress
                                        className="w-100"
                                        id="progressBar"
                                        max="100"
                                        value={item?.onprogress || 0}
                                        // value="30"
                                        imgloadin
                                      ></progress>
                                      {item?.onprogress}%
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          // </div>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group gap">
                        <label className="form-title">
                          Company Cover video
                        </label>
                        <label
                          className="mb-0 drop-drag-area  p-5 text-center cursor w-100 "
                          htmlFor="coverVideo"
                          onDrop={(e) => {
                            e.preventDefault();
                            e.target.classList.add("highlight");
                            const files = e?.dataTransfer?.files;
                            if (files && files.length > 0) {
                              handleMultiMediaValidation(
                                files?.[0],
                                "coverVideo"
                              );
                            }

                            e.target.classList.remove("highlight");
                          }}
                          onDragOver={(e) => {
                            e.target.classList.add("highlight");

                            e.preventDefault();
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.target.classList.remove("highlight");
                          }}
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              handleMultiMediaValidation(
                                files?.[0],
                                "coverVideo"
                              );
                            }
                          }}
                        >
                          Drag and drop files here or click to select files
                          <input
                            type="file"
                            id="coverVideo"
                            className="d-none"
                            multiple
                          />
                        </label>
                        <small className="form-text small-note">
                          Only MP4 and MKV formats are allowed, with a maximum
                          of 1 video permitted.
                        </small>

                        <small className="text-danger">
                          {errorMsg?.coverVideo}
                        </small>
                      </div>
                      <div className="update-img-container row ">
                        {selectedDocs.map(
                          (item) =>
                            item.keyWord === "coverVideo" && (
                              <div className="d-flex justify-content-start align-items-start video-cont">
                                <video
                                  src={item.imageReaderURL}
                                  controls="controls"
                                  autoPlay={false}
                                  muted={true}
                                />
                                <div
                                  onClick={() =>
                                    removeSelectedDoc(
                                      item?.pdfFile?.name,
                                      "coverVideo"
                                    )
                                  }
                                  className="cursor"
                                >
                                  <i className="fa-solid fa-xmark"></i>
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    </div>

                    <div className="col-12 action">
                      {isLoading ? (
                        <button
                          type="button"
                          className="action-btn btn-1 w-100"
                        >
                          <i className="fas fa-spinner fa-spin"></i>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="action-btn btn-1 w-100 submitButton"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-center">
                    <small
                      className="text-muted title-small cursor"
                      onClick={() => {
                        navigate(`/CompanyDetails/RepresentiveDetails`);
                      }}
                    >
                      Skip
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default CompanyMircoSiteDocs;
