import ReadOnly from "components/Forms/Shared/ReadOnly";
import DisplayOneImage from "components/Shared/Dashboards/DisplayOneImage";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import { getMonthName as getDate } from "utils/getMonthName";

export default function CustomProductInfo(props) {
  let { requestedData, handleImageClick } = props;
  let getMonthName = getDate;
  return (
    <>
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p> Custom Product Details</p>
          <div className="w-100 ">
            <div className="row  row-gap">
              <div className="col-6">
                <ReadOnly
                  title="Product Name"
                  value={requestedData?.productName}
                />
              </div>

              <div className="col-6">
                <ReadOnly title="status" value={requestedData?.status} />
              </div>
              <div className="col-6">
                <ReadOnly
                  title="shipping Conditions"
                  value={requestedData?.shippingConditions}
                />
              </div>

              <div className="col-6">
                <ReadOnly
                  title="shipping Type and Size"
                  value={requestedData?.shippingSize}
                />
              </div>

              <div className="col-6">
                <ReadOnly
                  title="supply Location"
                  value={requestedData?.supplyLocation}
                />
              </div>

              <div className="col-6">
                <ReadOnly
                  title="packing Conditions"
                  value={requestedData?.packingType}
                />
              </div>

              <div className="col-6">
                <ReadOnly
                  title="qualityConditions"
                  value={requestedData?.qualityConditions}
                />
              </div>

              <div className="col-6">
                <ReadOnly
                  title="Created At"
                  value={getMonthName(
                    requestedData?.createdAt?.split("T")?.[0]
                  )}
                />
              </div>

              <div className="col-6">
                <ReadOnly
                  title="Deadline "
                  value={getMonthName(requestedData?.deadline?.split("T")?.[0])}
                />
              </div>

              {/* ---------------------------- */}

              {requestedData?.specialCharacteristics &&
                Object.keys(requestedData?.specialCharacteristics)?.length >
                  0 && (
                  <div className="col-12 ">
                    <label className="fw-600 mb-1">
                      Product Characteristics
                    </label>

                    <div className="form-group form-control p-4 ">
                      <div className="row row-gap">
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
                  title="Technical Specifications"
                  value={requestedData?.technicalSpecifications}
                />
              </div>

              <div className="col-12">
                <ReadOnly title="inqueries" value={requestedData?.inqueries} />
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

      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p> TradeMark</p>

          <DisplayOneImage
            handleImageClick={handleImageClick}
            image={requestedData?.tradeMark}
          />
        </div>
      </div>
    </>
  );
}
