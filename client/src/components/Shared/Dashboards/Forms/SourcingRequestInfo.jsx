import ReadOnly from "components/Forms/Shared/ReadOnly";
import { getMonthName as getDate } from "utils/getMonthName";
import DisplayMultiImages from "../DisplayMultiImages";

export default function SourcingRequestInfo({
  requestedData,
  handleImageClick,
}) {
  let getMonthName = getDate;
  return (
    <>
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p> Sourcing Request Details</p>
          <div className="w-100 ">
            <div className="row  row-gap">
              <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                <ReadOnly
                  title="Product Name"
                  value={requestedData?.productName}
                />
              </div>

              <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                <ReadOnly title="Quantity" value={requestedData?.quantity} />
              </div>

              <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                <ReadOnly
                  title="packing Conditions"
                  value={requestedData?.packingConditions}
                />
              </div>

              <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                <ReadOnly
                  title="Quality Conditions"
                  value={requestedData?.qualityConditions}
                />
              </div>

              <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                <ReadOnly
                  title="shipping Conditions"
                  value={requestedData?.shippingConditions}
                />
              </div>

              <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                <ReadOnly
                  title="payment Terms"
                  value={requestedData?.paymentTerms}
                />
              </div>

              <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                <ReadOnly
                  title="available"
                  value={requestedData?.available ? "In Stock" : "Out Of Stock"}
                />
              </div>

              <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                <ReadOnly
                  title="Created At"
                  value={getMonthName(
                    requestedData?.createdAt?.split("T")?.[0]
                  )}
                />
              </div>

              <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                <ReadOnly
                  title="Deadline "
                  value={getMonthName(requestedData?.deadline?.split("T")?.[0])}
                />
              </div>

              <div className=" col-xxl-6 col-xl-6   col-lg-6 col-md-6 col-sm-12  ">
                <ReadOnly
                  title="Preferred Countries"
                  value={requestedData?.preferredCountries?.join(", ") || "All"}
                />
              </div>

              {/* ---------------------------- */}

              {requestedData?.specialCharacteristics &&
                Object?.keys(requestedData?.specialCharacteristics)?.length >
                  0 && (
                  <div className="col-12 ">
                    <label className="fw-600 mb-1">
                      Product Characteristics
                    </label>

                    <div className="form-control p-4 p-0 ">
                      <div className="row row-gap ">
                        {Object?.entries(
                          requestedData?.specialCharacteristics
                        )?.map(([key, value], index) => (
                          <div className="col-6">
                            <ReadOnly title={key} value={value} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              {/* ----------------------------------------- */}

              <div className="col-12">
                <ReadOnly
                  title="Product Description"
                  value={requestedData?.productDescription}
                />
              </div>

              <div className="col-12">
                <ReadOnly
                  title="Other Information"
                  value={requestedData?.otherInfoRequest}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p> Documents</p>
          <DisplayMultiImages
            handleImageClick={handleImageClick}
            images={requestedData?.docs}
          />
        </div>
      </div>
    </>
  );
}
