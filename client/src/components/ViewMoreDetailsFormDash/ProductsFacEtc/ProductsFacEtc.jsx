import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { pdfIcon } from "constants/Images";

import { handleImageError } from "utils/ImgNotFound";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";

import { useNavigate, useSearchParams } from "react-router-dom";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import Carousel from "react-grid-carousel";
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
export default function ProductsFacEtc() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const [apiLoadingData, setapiLoadingData] = useState(true);

  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });

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
              {/* <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <div className="d-flex justify-content-between">
                    <p>Factory Information</p>
                    <button
                      className="edit-profile"
                      onClick={() => {
                        
                        navigate("/factorydashboard/mircoSite#factorylogo");
                      }}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          
                          <div className="form-group">
                            <label>Factory Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={factoryDetails?.name || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Role</label>
                            <input
                              type="text"
                              className="form-control text-dark"
                              value="Factory"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representative phone number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={factoryDetails?.repPhone || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Representative Name</label>
                            <input
                              className="form-control text-dark"
                              value={`${
                                factoryDetails?.repName == null
                                  ? " "
                                  : `${factoryDetails?.repName?.[0]}  ${factoryDetails?.repName?.[1]}`
                              }`}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label> Representative email</label>
                            <input
                              type="text"
                              className="form-control"
                              value={factoryDetails?.repEmail || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Product Details</p>
                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Product Name</label>
                            <input
                              className="form-control"
                              value={PosData?.name || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>sku</label>
                            <input
                              className="form-control"
                              value={PosData?.sku || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>hsnCode</label>
                            <input
                              className="form-control"
                              value={PosData?.hsnCode || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Price</label>
                            <input
                              className="form-control"
                              value={PosData?.price || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>available</label>
                            <input
                              className="form-control"
                              value={
                                PosData?.available ? "In Stock" : "Out Of Stock"
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Min Order Quantity</label>
                            <input
                              className="form-control"
                              value={PosData?.minOrderQuantity || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Max Order Quantity</label>
                            <input
                              className="form-control"
                              value={PosData?.manOrderQuantity || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Guarantee</label>
                            <input
                              className="form-control"
                              value={PosData?.guarantee || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Average Rate</label>
                            <input
                              className="form-control"
                              value={PosData?.averageRate || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Created At </label>
                            <input
                              className="form-control"
                              value={
                                `${getMonthName(
                                  PosData?.createdAt?.split("T")?.[0]
                                )}` || ""
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {/* ---------------------------- */}

                      {PosData?.specialCharacteristics &&
                        Object?.keys(PosData?.specialCharacteristics)?.length >
                          0 && (
                          <div className="col-12 ">
                            <div className="grid-gap-col">
                              <div className="form-group">
                                <label>Product Characteristics</label>
                              </div>
                            </div>

                            <div className="form-group form-control p-4 ">
                              <div className="row row-gap">
                                {Object?.entries(
                                  PosData?.specialCharacteristics
                                )?.map(([key, value], index) => (
                                  <div className="col-6">
                                    <div className="grid-gap-col">
                                      <div className="form-group">
                                        <label>{key} </label>
                                        <input
                                          className="form-control"
                                          value={value || ""}
                                          readOnly
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      {/* ----------------------------------------- */}

                      <div className="col-12">
                        <div className="form-group">
                          <label> Product Description</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={PosData?.description || ""}
                            readOnly
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* {PosData?.images !== null && ( */}
              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Product Banners</p>
                  <div className="w-100 ">
                    {/* ----------------------- */}
                    <div className="row grid-gap-col">
                      <div className="col-12">
                        {PosData?.images !== null && PosData?.images ? (
                          <Carousel
                            cols={2}
                            rows={1}
                            gap={10}
                            scrollSnap={true}
                            loop
                            showDots
                            hideArrow={false}
                          >
                            {PosData?.images?.map((item) => (
                              <Carousel.Item>
                                <div
                                  className="dots-slider-img w-100  cursor"
                                  onClick={() => {
                                    setShowImagePop({
                                      display: true,
                                      imagePath: `${baseUrl_IMG}/${item}`,
                                    });
                                  }}
                                >
                                  <img
                                    className="h-100 w-100 "
                                    id={handleImageError}
                                    src={
                                      item?.includes("pdf")
                                        ? pdfIcon
                                        : `${baseUrl_IMG}/${item}`
                                    }
                                    alt={item?.pdfFile?.name?.includes("pdf")}
                                    onError={handleImageError}
                                  />
                                </div>
                              </Carousel.Item>
                            ))}
                          </Carousel>
                        ) : (
                          <h5 className="text-muted text-center py-3">Empty</h5>
                        )}
                      </div>
                    </div>
                    {/* </form> */}
                    {/* ----------------------- */}
                  </div>
                </div>
              </div>
              {/* //   )} */}

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Image</p>
                  <div className="w-100 ">
                    {/* ----------------------- */}
                    <div className="row grid-gap-col">
                      <div className="col-12">
                        {PosData?.coverImage !== null && PosData?.coverImage ? (
                          <div
                            className="dots-slider-img w-100  cursor"
                            onClick={() => {
                              setShowImagePop({
                                display: true,
                                imagePath: `${baseUrl_IMG}/${PosData?.coverImage}`,
                              });
                            }}
                          >
                            <img
                              className="h-100 w-100 "
                              id={handleImageError}
                              src={
                                PosData?.coverImage?.includes("pdf")
                                  ? pdfIcon
                                  : `${baseUrl_IMG}/${PosData?.coverImage}`
                              }
                              alt={PosData?.coverImage?.pdfFile?.name?.includes(
                                "pdf"
                              )}
                              onError={handleImageError}
                            />
                          </div>
                        ) : (
                          <h5 className="text-muted text-center py-3">Empty</h5>
                        )}
                      </div>
                    </div>
                  </div>
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
