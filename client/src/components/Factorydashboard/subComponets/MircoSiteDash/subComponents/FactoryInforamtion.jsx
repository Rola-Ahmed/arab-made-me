import React from "react";

export default function FactoryInforamtion(props) {
  let { handleShow, Button, factoryProfile } = props;
  return (
    <>
      <div id="FactoryInforamtion"></div>
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          {" "}
          <p>Factory Inforamtion</p>
          <div className="w-100 ">
            {" "}
            <div className="row  row-gap">
              <div className="col-6">
                <div className="grid-gap-col">
                  <div className="form-group">
                    <label>Factory Name</label>
                    <input
                      className="form-control"
                      value={factoryProfile?.name || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Year Of establishment</label>
                  <input
                    className="form-control"
                    value={factoryProfile?.yearOfEstablishmint || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Country</label>
                  <input
                    className="form-control"
                    value={factoryProfile?.country || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>City</label>
                  <input
                    className="form-control"
                    value={factoryProfile?.city || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>Yearly Sales Income</label>
                  <input
                    className="form-control"
                    value={factoryProfile?.yearlySalesIncome || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>Number of employees</label>
                  <input
                    className="form-control"
                    value={factoryProfile?.numberOfEmployees || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>Business Registration Number</label>
                  <input
                    className="form-control"
                    value={factoryProfile?.taxRegisterationNumber || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>commercial Registeration Number</label>
                  <input
                    className="form-control"
                    value={factoryProfile?.commercialRegisterationNumber || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>Factory Phone Number</label>
                  <input
                    className="form-control"
                    value={factoryProfile?.phone || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>Factory Location</label>
                  <input
                    className="form-control"
                    value={factoryProfile?.address?.[0] || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="form-group">
                  <label>exporting Countries</label>
                  <input
                    className="form-control"
                    value={
                      factoryProfile?.importingCountries?.length !== 0
                        ? (
                            factoryProfile?.importingCountries?.map((item) =>
                              Array.isArray(item) ? item.join(", ") : item
                            ) || []
                          ).join(", ")
                        : ""
                    }
                    readOnly
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label>Factory description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={factoryProfile?.description || ""}
                    readOnly
                  ></textarea>
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label>Why Us</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={factoryProfile?.whyUs || ""}
                    readOnly
                  ></textarea>
                </div>
              </div>

              <div className="col-12">
                <Button
                  className="btn-edit"
                  variant="primary"
                  onClick={() => handleShow("factoryInfoChangeReadOnly")}
                >
                  <p className="cursor">Change Factory Information </p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
