import Header from "components/main/Header/Header";
import { useSearchParams } from "react-router-dom";

// import "../SignUp.css";
import "./SignUpMessage.css";

function SignUpMessage() {
  const [searchParams] = useSearchParams();
  const emailAddress = searchParams.get("emailAddress");
  return (
    <>
      <Header title="Sign Up Verfication" subTitle="Verfication" />
      <section className="register-msg login overflow-hidden">
        <div className="container d-flex justify-content-center align-content-center">
          <div className="frame-container-1">
            <div className="text-center pb-3">
              <i class="fa-solid fa-envelope-circle-check icon-msg"></i>
            </div>
            <div className="container content-1">
              <label className="fw-bolder  text-center  d-block text-title">
                {/* Activate Your Account */}
                Verify your email address
              </label>
              <div className="sub-content">
                <div className="input-content">
                  <div className="form-1 row ">
                    <label className="text-muted user-text-sub text-center w-100 d-block ">
                      {" "}
                      Thank you for creating an account with arabmade! You
                      should shortly receive an email with the activation link
                      at{" "}
                      <span className="text-dark fw-bold">{emailAddress} </span>
                      {/* within 5 minutes to finalize your account
                      creation. */}
                    </label>
                    <label className="text-muted user-text-sub text-center w-100 d-block ">
                      {" "}
                      Nothing in Sight? Check your Spam Folder.
                    </label>

                    {/* <a href="mailto:rolaahmed1807542@miueypt.edu.eg?subject=Activate%20Your%20Account&body=Click%20the%20following%20link%20to%20activate%20your%20account:%20https%3A%2F%2Fexample.com%2Factivate%2F123456" target="_blank" rel="noopener noreferrer">
        <button>Activate Your Account</button>
    </a> */}
                    {/* <label className="fw-bolder">
                      You should shortly receive an email with the activation
                      link
                    </label> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export default SignUpMessage;
