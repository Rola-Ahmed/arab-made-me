import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { logo } from "constants/Images";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "config.js";

function ImporterEmailActivatedMsg() {
  const [searchParams] = useSearchParams();
  const activationToken = searchParams.get("action");

  document.title = "Buyer Emial Activation";

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  const [Msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submitForm() {
    setErrorMsg("");
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/importers/confirmEmail/${activationToken}`,
      };

      const response = await axios.request(config);

      if (response?.data?.message === "done") {
        localStorage.setItem("RecoverAccMsg", true);
        setMsg(true);
      } else {
        setMsg(false);
        setErrorMsg("Link Expired");
      }
    } catch (error) {
      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case "jwt malformed":
            setErrorMsg("Link Expired");
            break;
          case 400:
            // setErrorMsg(error?.response?.data?.errorMessage);
            // setErrorMsg(error?.response?.data?.errorMessage);
            setErrorMsg("Link Expired");

            break;
          case 401:
            setErrorMsg("User is not Unauthorized ");
            break;
          case 403:
            setErrorMsg(
              "Forbidden, You do not have permission to access this resource."
            );
            break;
          case 404:
            setErrorMsg(error?.response?.data?.errorMessage);
            break;

          case 500:
            setErrorMsg(error?.response?.data?.errorMessage);
            break;

          //  429 Too Many Requests
          // The user has sent too many requests in a given amount of time ("rate limiting").
          case 429:
            setErrorMsg(" Too Many Requests , Please try again later.");
            break;
          case 402:
            // 402
            setErrorMsg(error?.response?.data?.message);
            break;
          default:
            // case message== error
            setErrorMsg(error?.response?.data?.errorMessage);
            break;
        }
      } else {
        setErrorMsg("An unexpected error occurred. Please try again later.");
      }

      if (error.message === "Network Error") {
        setErrorMsg("Something Went Wrong Please Try Again");
      } else if (error.message === "error") {
        setErrorMsg(error?.response?.data?.errorMessage);
      }
    }
  }

  useEffect(() => {
    submitForm();
  }, []);

  // useEffect(() => {
  if (activationToken == null) {
    localStorage.setItem("ToHomePage", "Page Not Found");
    navigate("/");
  }
  // }, [activationToken]);

  async function ReSendToken(e) {
    e.preventDefault();
    let userId = "";
    if (activationToken !== null && activationToken !== undefined) {
      // Decode the token
      // userId = jwtDecode(activationToken)?.id;

      try {
        userId = jwtDecode(activationToken)?.id;
        // Rest of your code...
      } catch (error) {
        setErrorMsg("Try Again");
        return;

        // localStorage.setItem(
        //   "ToHomePage",
        //   "Try Again"
        // );
        //  navigate("/");
      }
    } else {
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/importers/resendConfirmationMail/${userId}`,
      };

      const response = await axios.request(config);

      if (response?.data?.message === "done") {
        setMsg(true);
      } else {
        // setErrorMsg(false);
        setErrorMsg(response?.data?.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      // setErrorMsg(false);

      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case "jwt malformed":
            setErrorMsg("Link Expired");
            break;
          case 400:
            setErrorMsg("Link Expired");
            break;
          case 401:
            setErrorMsg("User is not Unauthorized ");
            break;
          case 403:
            setErrorMsg(
              "Forbidden, You do not have permission to access this resource."
            );
            break;
          case 404:
            setErrorMsg(error?.response?.data?.errorMessage);
            break;

          case 500:
            setErrorMsg(error?.response?.data?.errorMessage);
            break;

          //  429 Too Many Requests
          // The user has sent too many requests in a given amount of time ("rate limiting").
          case 429:
            setErrorMsg(" Too Many Requests , Please try again later.");
            break;
          case 402:
            // 402
            setErrorMsg(error?.response?.data?.message);
            break;
          default:
            // case message== error
            setErrorMsg(error?.response?.data?.errorMessage);
            break;
        }
      } else {
        setErrorMsg("An unexpected error occurred. Please try again later.");
      }

      if (error.message === "Network Error") {
        setErrorMsg("Something Went Wrong Please Try Again");
      } else if (error.message === "error") {
        setErrorMsg(error?.response?.data?.errorMessage);
      }
    }
  }

  return (
    <>
      
      <section className="register-msg ">
        {/* <div className="container "> */}
        <div className=" container ">
          {Msg ? (
            <>
              {" "}
              <div className="sec-div d-flex justify-content-center">
                <div className="frame-container-1 p-5">
                  <div className="cont-frame-1 ">
                    <div className="img-logo w-100">
                      <img src={logo} />
                    </div>

                    <label className="text-title m-auto">Email Activated</label>

                    <p className="text-sub m-auto">
                      Buyer Email has been activated
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="sec-div d-flex justify-content-center">
              <div className="frame-container-1 p-5">
                <div className="cont-frame-1 ">
                  <div className="img-logo w-100">
                    <img src={logo} />
                  </div>

                  <label className="text-title m-auto"> {errorMsg}</label>

                  <p className="text-sub m-auto">
                    Re Send email inorder to receive an activation link
                  </p>

                  <div className="row gap-row">
                    <div className="col-12 action">
                      <form className="w-100" onSubmit={(e) => ReSendToken(e)}>
                        {isLoading ? (
                          <button
                            type="button"
                            className="action-btn btn-1 w-100"
                          >
                            <i className="fas fa-spinner fa-spin"></i>
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="action-btn btn-1 w-100 submitButton"
                          >
                            Re Send Link
                          </button>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

    </>
  );
}

export default ImporterEmailActivatedMsg;
