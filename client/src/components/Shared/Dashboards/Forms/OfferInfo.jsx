import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import ReadOnly from "components/Forms/Shared/ReadOnly";
import { getMonthName as getDate } from "utils/getMonthName";

export default function OfferInfo(props) {
  let { requestedData, handleImageClick, hideImage } = props;
  let getMonthName = getDate;
  return (
    <>
      {" "}
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p className="h5 fw-bolder title-header"> Offer Details</p>
          <div className="w-100 ">
            <div className="row  row-gap">
              <div className="col-6">
                <ReadOnly
                  title="Product Name"
                  value={requestedData?.productName}
                />
              </div>

              <div className="col-6">
                <ReadOnly
                  title="hsnCode"
                  value={requestedData?.productHSNCode}
                />
              </div>

              <div className="col-6">
                <ReadOnly title="Price" value={requestedData?.price} />
              </div>
              <div className="col-6">
                <ReadOnly
                  title="packing Conditions"
                  value={requestedData?.packingConditions}
                />
              </div>
              <div className="col-6">
                <ReadOnly
                  title="quality Conditions"
                  value={requestedData?.qualityConditions}
                />
              </div>

              <div className="col-6">
                <ReadOnly
                  title="shipping Conditions"
                  value={requestedData?.shippingConditions}
                />
              </div>

              <div className="col-6">
                <ReadOnly
                  title="Delivery Terms"
                  value={requestedData?.deliveryTerms}
                />
              </div>

              <div className="col-6">
                <ReadOnly
                  title="payment Terms"
                  value={requestedData?.paymentTerms}
                />
              </div>

              <div className="col-6">
                <ReadOnly
                  title="available"
                  value={requestedData?.available ? "In Stock" : "Out Of Stock"}
                />
              </div>

              <div className="col-6">
                <ReadOnly
                  title="preferred Countries"
                  value={`${
                    requestedData?.preferredCountries?.join(", ") || "All"
                  }  `}
                />
              </div>

              <div className="col-md-6 col-sm-12">
                <ReadOnly title="Quantity" value={requestedData?.quantity} />
              </div>

              <div className="col-md-6 col-sm-12">
                <ReadOnly
                  title="Created At"
                  value={getMonthName(
                    requestedData?.createdAt?.split("T")?.[0]
                  )}
                />
              </div>

              {/* ---------------------------- */}

              {/* {requestedData?.specialCharacteristics &&
                Object?.keys(requestedData?.specialCharacteristics)?.length >
                  0 && (
                  <div className="col-12 ">
                    <label className="fw-600 mb-1">
                      Product Characteristics
                    </label>

                    <div className="form-group form-control p-4 ">
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
                )} */}

              <div className="col-12">
                <ReadOnly
                  title="Product Description"
                  value={requestedData?.productDescription}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {!hideImage && (
        <div className="container-profile-input w-100">
          <div className="title-contianer-input w-100">
            <p className="h5 fw-bolder title-header"> Product Images</p>
            <DisplayMultiImages
              handleImageClick={handleImageClick}
              images={requestedData?.images}
            />
          </div>
        </div>
      )}
    </>
  );
}
