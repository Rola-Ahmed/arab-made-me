export default function AccountInformation(props) {
  let { currentUserData, factoryProfile, handleShow, Button } = props;
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
                      value={currentUserData?.userEmail || ""}
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
                <Button
                  className="btn-edit"
                  variant="primary"
                  onClick={() => handleShow("accountInfoReadOnly")}
                >
                  <p className="cursor">Change Account Information </p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
