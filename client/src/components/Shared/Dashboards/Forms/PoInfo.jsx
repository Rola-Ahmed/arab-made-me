import ReadOnly from "components/Forms/Shared/ReadOnly";
import { getMonthName as getDate } from "utils/getMonthName";
import DisplayMultiImages from "../DisplayMultiImages";
import DisplayOneImage from "components/Shared/Dashboards/DisplayOneImage";
export default function PoInfo({
    requestedData,
    handleImageClick,
  })
  
  {
      let getMonthName = getDate;
  return (
    <>     <div className="container-profile-input w-100">
    <div className="title-contianer-input w-100">
      <p> Purchasing Order Details</p>
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
              title="status"
              value={requestedData?.status}
            />
          </div>

          <div className="col-6">
            <ReadOnly
              title="deadline"
              value={requestedData?.deadline}
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
              title="shipping Type and Size"
              value={requestedData?.shippingTypeAndSize}
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
              value={requestedData?.qualityConditions}
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
              title="payment Terms"
              value={requestedData?.paymentTerms}
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

          {/* ---------------------------- */}

          <div className="col-12 ">
            <div className="grid-gap-col">
              <div className="form-group">
                <label>Time Line</label>
              </div>
            </div>

            {/* <div className="form-group form-control "> */}
            <div className="form-group form-control p-4 ">
              {requestedData?.timeLine?.map((item, index) => (
                <div className="row  row-gap">
                  <div className="col-6">
                    <div className="grid-gap-col">
                      <div className="form-group">
                        <label>Date {index + 1}</label>
                        <input
                          className="form-control"
                          value={
                            `${getMonthName(
                              item?.date?.split("T")?.[0]
                            )}` || ""
                          }
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="grid-gap-col">
                      <div className="form-group">
                        <label forhtml="specialCharDesc">
                          Quantity {index + 1}
                        </label>
                        <input
                          className="form-control"
                          value={item.quantity}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* </div> */}
            </div>
          </div>
          {/* ----------------------------------------- */}

          <div className="col-12">
            <ReadOnly
              title="Instructions"
              value={requestedData?.instructions}
            />
          </div>
          <div className="col-12">
            <ReadOnly
              title="Conditions Of Delays"
              value={requestedData?.conditionsOfDelays}
            />
          </div>

          <div className="col-12">
            <ReadOnly
              title="Time Of Manufacturing Delay"
              value={requestedData?.timeOfManufacturingDelay}
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


  <div className="container-profile-input w-100">
                  <div className="title-contianer-input w-100">
                    <p> TradeMark</p>

                    <DisplayOneImage
                      handleImageClick={handleImageClick}
                      image={requestedData?.legalStamp}
                    />
                  </div>
                </div>
  </>
  )
}
