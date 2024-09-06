import InputField from "components/Forms/Shared/InputField";
import Modal from "react-bootstrap/Modal";

export default function editAccountInfoAccountInformation(props) {
  let {
    factoryProfile,
    handleClose,
    errorMsg,
    AccountInfoValidation,
    isLoading,
    countriesMiddleEast,
    modalShow,
    setModalShow,
  } = props;

  return (
    <>
      <div id="accountInformation"></div>

      <div id="accountInformation" className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p>Account Inforamtions</p>
          <div className="w-100 ">
            <div className="row  row-gap">
              <div className="col-6">
                <div className="grid-gap-col">
                  <div className="form-group">
                    <label>Business Account</label>
                    <input
                      className="form-control"
                      value={factoryProfile?.businessEmail || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="grid-gap-col">
                  <div className="form-group">
                    <label>User Type</label>
                    <input className="form-control" value="Factory" readOnly />
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="grid-gap-col">
                  <div className="form-group">
                    <label>representive First Name</label>
                    <input
                      className="form-control"
                      value={factoryProfile?.repName?.[0] || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>representive Last Name</label>
                  <input
                    className="form-control"
                    value={factoryProfile?.repName?.[1] || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="grid-gap-col">
                  <div className="form-group">
                    <label> Representive Email</label>
                    <input
                      type="text"
                      className="form-control"
                      value={factoryProfile?.repEmail || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="grid-gap-col">
                  <div className="form-group">
                    <label>Representive Phone Number</label>
                    <input
                      className="form-control"
                      value={factoryProfile?.repPhone || ""}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <button
                  className="btn-edit"
                  type="button"
                  //
                  onClick={() =>
                    setModalShow({
                      accountInfo: true,
                      legalDocs: false,
                    })
                  }
                >
                  <p className="cursor">Change Account Information </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account setting Info Chnage  update form*/}
      <Modal
        show={modalShow?.accountInfo}
        onHide={() => handleClose()}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          <div className="modal-content   px-4 py-4">
            <div className="modal-header mb-3">
              <h4 className="modal-title fw-normal">Account Inforamtions</h4>
              <button
                type="button"
                className="close bg-0 border-0"
                data-dismiss="modal"
                aria-label="Close"
                data-bs-dismiss="modal"
                onClick={() => handleClose()}
              >
                <i className="fa-solid fa-xmark fs-24"></i>
              </button>
            </div>
            <div className="modal-body p-0 ">
              {" "}
              {errorMsg && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg}
                </div>
              )}
              <div className="w-100  ">
                <form onSubmit={AccountInfoValidation.handleSubmit}>
                  <div className="row  row-gap">
                    <div className="col-6">
                      <InputField
                        formValidation={AccountInfoValidation}
                        vlaidationName="repFirstName"
                        isRequire={true}
                        title="Representive first Name"
                      />
                    </div>
                    <div className="col-6">
                      <InputField
                        formValidation={AccountInfoValidation}
                        vlaidationName="repLastName"
                        isRequire={true}
                        title="Representive Last Name"
                      />
                    </div>

                    <div className="col-6">
                      <InputField
                        formValidation={AccountInfoValidation}
                        vlaidationName="repEmail"
                        isRequire={true}
                        title="Representive Email"
                      />
                    </div>

                    <div className="col-6">
                      <div className="form-group">
                        <label className=" form-title m-0 p-0">
                          Representive Phone Number *
                        </label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <select
                              className="input-group-text h-100 p-2 m-0 phone-borders"
                              id="repPhoneCode"
                              onChange={AccountInfoValidation.handleChange}
                              onBlur={AccountInfoValidation.handleBlur}
                              value={AccountInfoValidation.values.repPhoneCode}
                            >
                              {countriesMiddleEast.map((phoneItem) => (
                                <option
                                  value={phoneItem.phoneCode}
                                  key={phoneItem.phoneCode}
                                >
                                  {phoneItem.phoneCode}
                                </option>
                              ))}
                            </select>
                          </div>
                          <input
                            type="text"
                            className="form-control phone-border"
                            id="repPhone"
                            name="repPhone"
                            placeholder="1113534343"
                            onChange={AccountInfoValidation.handleChange}
                            value={AccountInfoValidation.values.repPhone}
                            onBlur={AccountInfoValidation.handleBlur}
                          />
                        </div>
                        {AccountInfoValidation.errors.repPhone &&
                        AccountInfoValidation.touched.repPhone ? (
                          <small className="form-text text-danger">
                            {AccountInfoValidation.errors.repPhone}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-12 d-flex justify-content-start btn-modal-gap mt-3">
                      <button
                        className="border-0 rounded-3 bg-header fs-14 fw-600 px-3 py-2"
                        type="button"
                        data-bs-dismiss="modal"
                        onClick={() => handleClose()}
                      >
                        Close
                      </button>
                      {isLoading ? (
                        <button type="button" className="btn-edit">
                          <i className="fas fa-spinner fa-spin text-white px-5"></i>
                        </button>
                      ) : (
                        <button
                          className="rounded-3 border-0 bg-main text-white px-3 py-2 fs-14 fw-bolder"
                          type="submit"
                        >
                          <p className="cursor">save changes</p>
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
