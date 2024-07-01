import React from "react";

export default function FactoryInfo(props) {
  //
  let { productDetailsArr, productDetails } = props;

  return (
    <div className="input-content ">
      <div className="title-text w-100 ">
        <h5>Factory Details</h5>
      </div>

      <div className="row row-container w-100 ">
        <div className="col-md-6 col-sm-12">
          <div className="form-group">
            <label>Factory Name</label>
            <input
              type="text"
              className="form-control"
              value={productDetailsArr?.name || productDetails?.name || ""}
              readOnly
            />
          </div>
        </div>

        <div className="col-md-6 col-sm-12">
          <div className="form-group">
            <label>Representative Name</label>
            <input
              type="text"
              className="form-control text-dark"
              value={
                productDetailsArr?.repName?.join(" ") ||
                productDetails?.repName?.join(" ") ||
                ""
              }
              readOnly
            />
          </div>
        </div>

        <div className="col-md-6 col-sm-12">
          <div className="form-group">
            <label> Representative email</label>
            <input
              type="text"
              className="form-control"
              value={
                productDetailsArr?.repEmail || productDetails?.repEmail || ""
              }
              readOnly
            />
          </div>
        </div>

        <div className="col-md-6 col-sm-12">
          <div className="form-group">
            <label>Representative phone number</label>
            <input
              type="text"
              className="form-control"
              value={
                productDetailsArr?.repPhone || productDetails?.repPhone || ""
              }
              readOnly
            />
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label>description</label>
            <textarea
              type="text"
              className="form-control"
              value={
                productDetailsArr?.description ||
                productDetails?.description ||
                ""
              }
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
