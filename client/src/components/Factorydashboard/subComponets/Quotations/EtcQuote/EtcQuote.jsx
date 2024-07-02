// 3rd party
import { useNavigate } from "react-router-dom";

// import FactoryUnVerified from "components/ActionMessages/FactoryUnVerifiedDash/FactoryUnVerifiedDash";
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { getMonthName as getDate } from "utils/getMonthName";

// sub Components
// import HeaderSection from "./HeaderSection";
import FactoryInfo from "components/Factorydashboard/Shared/FactoryInfo";
import ImporterInfo from "components/Factorydashboard/Shared/ImporterInfo";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";

export default function EtcQuote(props) {
  let { requestedData, isLogin } = props;
  let getMonthName = getDate;
  let navigate = useNavigate();

  return (
    <>
      {/* <IsLoggedIn
        show={modalShow.isLogin}
        // show={true}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
        distination={isLoggedReDirect}
        bgBlur={"bg-blur"}
      /> */}

      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="Quotations" />

        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2>Quotations Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/factorydashboard/quotations");
                }}
              >
                <p className="cursor">Quotations</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              <FactoryInfo />
              <ImporterInfo importerData={requestedData?.importer} />

              <div className="container-profile-input w-100">
                <div className="title-contianer-input w-100">
                  <p> Quotations Details</p>
                  <div className="w-100 ">
                    <div className="row  row-gap">
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Product Name</label>
                            <input
                              className="form-control"
                              value={requestedData?.productName || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Min Quantity</label>
                            <input
                              className="form-control"
                              value={requestedData?.minQuantity || ""}
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
                              value={requestedData?.price || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Discounts</label>
                            <input
                              className="form-control"
                              value={requestedData?.discounts || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>shipping Conditions</label>
                            <input
                              className="form-control"
                              value={requestedData?.shippingConditions || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>packing Conditions</label>
                            <input
                              className="form-control"
                              value={requestedData?.packingConditions || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Quality Conditions</label>
                            <input
                              className="form-control"
                              value={requestedData?.qualityConditions || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>payment Terms</label>
                            <input
                              className="form-control"
                              value={requestedData?.paymentTerms || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>Start Delivery Date</label>
                            <input
                              className="form-control"
                              value={
                                requestedData?.timeForDelivery?.start || ""
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>End Delivery Date</label>
                            <input
                              className="form-control"
                              value={requestedData?.timeForDelivery?.end || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="grid-gap-col">
                          <div className="form-group">
                            <label>status</label>
                            <input
                              className="form-control"
                              value={requestedData?.status || ""}
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
                                  requestedData?.createdAt?.split("T")?.[0]
                                )}` || ""
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {/* ---------------------------- */}

                      {requestedData?.specialCharacteristics &&
                        Object?.keys(requestedData?.specialCharacteristics)
                          ?.length > 0 && (
                          <div className="col-12 ">
                            <div className="grid-gap-col">
                              <div className="form-group">
                                <label>Product Characteristics</label>
                              </div>
                            </div>

                            <div className="form-group form-control p-4 ">
                              <div className="row row-gap">
                                {Object?.entries(
                                  requestedData?.specialCharacteristics
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
                          <label> Other Information</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={requestedData?.notes || ""}
                            readOnly
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 d-flex justify-content-start btn-modal-gap ">
                <button
                  className="btn-edit "
                  type="button"
                  onClick={() => {
                    navigate(
                      `/factorydashboard/editQuote/${requestedData?.quoteId}?quoteId=${requestedData?.id}&productName=${requestedData?.productName}`
                    );
                  }}
                >
                  <p className="cursor">Edit Quote</p>
                </button>

                <button
                  className="btn-edit border-btn bg-white d-none"
                  type="button"
                  onClick={() => {
                    // UpdateData("accepted");
                    navigate(
                      `/contactsupplier?userId=${requestedData?.importer?.userId}&importerName=${requestedData?.importer?.name}`
                    );
                  }}
                >
                  <p className="cursor text-success text-dark">Contact Buyer</p>
                </button>
                <ContactBtn
                  isLogin={isLogin}
                  // handleIsLoggedInBtn={handleIsLoggedInBtn}
                  recieverUserId={requestedData?.importer?.userId}
                  // baseUrl={baseUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
