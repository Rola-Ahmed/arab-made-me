import "./FactoryUnVerifiedDash.css";
import { useNavigate } from "react-router-dom";


export default function FactoryUnVerifiedDash() {
  let navigate = useNavigate();

  return (
    <div className=" order-section verify-mesg   h-100 pt-5">
      <div className="container cont  verified-cont  ">
        <h3 className="fw-bolder mb-4">Factory is Not Verifiyed yet</h3>
        <div className="row row-container  border-css p-4">
          <div className="col-12 mb-4">
            <label>
              Thank you for signing up for Arab Made. If you've been directed to
              this page, it means you haven't completed the registration
              process. Ensure you've completed the following steps to become
              verified:
            </label>
          </div>

          <div className="col-12  justify-content-start align-items-center d-flex">
            <label className="h1    m-0 p-2 px-3 me-4 steps-text">1</label>

            <label className="m-0 p-0">
              Make sure you have provided all the required legal documents in
              your factory profile.
            </label>
          </div>

          <div className="col-12  justify-content-start align-items-center d-flex">
            <label className="h1    m-0 p-2 px-3 me-4 steps-text">2</label>

            <label>Check your email to confirm Factory Email Activation.</label>
          </div>

          <div className="col-12  justify-content-start align-items-center d-flex">
            <label className="h1    m-0 p-2 px-3 me-4 steps-text">3</label>

            <label>Add your Commercial Registration Number.</label>
          </div>

          <div className="col-12  justify-content-start align-items-center d-flex">
            <small className="py-4">
              It might take up to 24 hours to fully activate your factory
              account. If you can't access your services after that time, please
              <span className="cont-btn"> contact support</span> .
            </small>
          </div>

          <div className="col-12  justify-content-start align-items-center d-flex">
            <div className="btn-container">
              <button
                className="order-btn-2 cursor"
                onClick={() => {
                  navigate("/factorydashboard/factoryProfile");
                }}
              >
                <p className="cursor">Complete Factory Verification</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
