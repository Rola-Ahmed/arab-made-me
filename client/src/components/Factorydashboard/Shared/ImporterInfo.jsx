import React from "react";

export default function ImporterInfo(props) {
  let { importerData } = props;
  return (
    <div className="container-profile-input w-100">
      <div className="title-contianer-input w-100">
        <div className="d-flex justify-content-between">
          <p>Buyer Information</p>
        </div>
        <div className="w-100 ">
          <div className="row  row-gap">
            <div className="col-6">
              <div className="grid-gap-col">
                {" "}
                <div className="form-group">
                  <label>Representative Name</label>
                  <input
                    type="text"
                    className="form-control text-dark"
                    value={`${
                      importerData?.repName == null
                        ? " "
                        : `${importerData?.repName}`
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
                    value={importerData?.repEmail || ""}
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
                    value={importerData?.repPhone || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
