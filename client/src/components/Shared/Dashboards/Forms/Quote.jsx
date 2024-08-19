import ReadOnly from "components/Forms/Shared/ReadOnly";
import { getMonthName as getDate } from "utils/getMonthName";

export default function Quote({requestedData}) {
  let getMonthName = getDate;

  return (
    <div className="container-profile-input w-100">
      <div className="title-contianer-input w-100">
        <p> Quotations Details</p>
        <div className="w-100 ">
          <div className="row  row-gap">

          <div className="col-6">
              <ReadOnly
                title="Quotation Code"
                value={requestedData?.id}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Product Name"
                value={requestedData?.productName}
              />
            </div>

            <div className="col-6">
              <ReadOnly title="Quantity" value={requestedData?.minQuantity} />
            </div>
            <div className="col-6">
              <ReadOnly title="Price" value={requestedData?.price} />
            </div>

            <div className="col-6">
              <ReadOnly title="Discounts" value={requestedData?.discounts} />
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
                title="quality Conditions"
                value={requestedData?.qualityConditions}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="payment Terms"
                value={requestedData?.paymentTerms}
              />
            </div>

            <div className="col-6">
              <ReadOnly title="status" value={requestedData?.status} />
            </div>

            <div className="col-6">
              <ReadOnly
                title="Created At"
                value={getMonthName(requestedData?.createdAt?.split("T")?.[0])}
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
                title="Other Information"
                value={requestedData?.notes}
              />
            </div>

            {requestedData?.timeLine &&
              Object.keys(requestedData?.timeLine)?.length > 0 && (
                <div className="col-12 ">
                  <label className="fw-600 mb-1">Delivery Timeline </label>

                  <div className="form-group form-control p-4 ">
                    <div className="row row-gap">
                      {requestedData?.timeLine.map((item, index) => (
                        <>
                          <div className="col-6">
                            <ReadOnly
                              title={`Date ${index + 1}`}
                              value={item.date}
                            />
                          </div>
                          <div className="col-6">
                            <ReadOnly
                              title={`quantity ${index + 1}`}
                              value={item.quantity}
                            />
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
