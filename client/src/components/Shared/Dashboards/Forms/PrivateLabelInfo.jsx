import ReadOnly from "components/Forms/Shared/ReadOnly";
import DisplayOneImage from "components/Shared/Dashboards/DisplayOneImage";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";
import { getMonthName as getDate } from "utils/getMonthName";

export default function PrivateLabelInfo(props) {
  let { requestedData,handleImageClick } = props;
  let getMonthName = getDate;
  return (
    <>
      {" "}
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p> Private Label Details</p>
          <div className="w-100 ">
            <div className="row  row-gap">
              {requestedData?.productName !== null && (
                <div className="col-6">
                  <ReadOnly
                    title="Product Name"
                    value={requestedData?.productName}
                  />
                </div>
              )}

              <div className="col-6">
                <ReadOnly title="quantity" value={requestedData?.quantity} />
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
                  value={requestedData?.packingConditions}
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

              <div className="col-12">
                <ReadOnly
                  title="More Details"
                  value={requestedData?.moreDetails}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {requestedData?.docs?.length > 0 ? ( */}
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p> Documents</p>
          <DisplayMultiImages
            handleImageClick={handleImageClick}
            image={requestedData?.requestedData?.docs}
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
