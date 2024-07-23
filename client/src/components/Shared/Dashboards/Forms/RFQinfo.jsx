import ProductDetails from "components/Forms/Shared/SelectedProductDetails";
import { getMonthName as getDate } from "utils/getMonthName";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";

export default function RFQinfo({ requestedData, handleImageClick }) {
  let getMonthName = getDate;

  return (
    <>
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p> RFQ Details</p>
          <div className="w-100 ">
            <div className="row  row-gap">
              <div className="col-6">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    className="form-control"
                    value={requestedData?.productName || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    className="form-control"
                    value={requestedData?.quantity || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>shipping Conditions</label>
                  <input
                    className="form-control"
                    value={requestedData?.shippingConditions || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>packing Conditions</label>
                  <input
                    className="form-control"
                    value={requestedData?.packingConditions || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>payment Terms</label>
                  <input
                    className="form-control"
                    value={requestedData?.paymentTerms || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>Quality Conditions</label>
                  <input
                    className="form-control"
                    value={requestedData?.qualityConditions || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>status</label>
                  <input
                    className="form-control"
                    value={requestedData?.status || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
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
              <div className="col-6">
                <label>Deadline</label>
                <input
                  className="form-control"
                  value={
                    `${getMonthName(
                      requestedData?.deadline?.split("T")?.[0]
                    )}` || ""
                  }
                  readOnly
                />
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label> Other Information</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={requestedData?.otherInfoRequest || ""}
                    readOnly
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-profile-input w-100">
        <ProductDetails productDetails={requestedData?.product} />
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
