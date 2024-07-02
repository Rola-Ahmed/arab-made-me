import React, { useState, useEffect } from "react";
import { awaitImg, nextImg, logo, userIcon } from "constants/Images";

import { jwtDecode } from "jwt-decode";

import "./EmailActivatedMsg.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "config.js";

function EmailActivatedMsg() {
  document.title = "Emial Activation";
  const [searchParams] = useSearchParams();
  const activationToken = searchParams.get("action");

  let navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  const [Msg, setMsg] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  async function submitForm() {
    setErrorMsg("");
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/users/confirmEmail/${activationToken}`,
      };

      const response = await axios.request(config);

      if (response?.data?.message === "done") {
        localStorage.setItem("RecoverAccMsg", true);
        // localStorage.removeItem("recoverEmailAction");
        setMsg(true);
        // localStorage.removeItem("emialActivation");
      } else {
        // setMsg({
        //   title: "Link Session",
        //   message:
        //     "Your account activation link has expired. Please sign up again to activate your account and start exploring our amazing features.",
        //   state: false,
        // });
        // localStorage.removeItem("emialActivation");
        setMsg(false);
        setErrorMsg("Link Expired");
      }
    } catch (error) {
      setMsg(false);
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
            if (error?.response?.data?.errorMessage == "jwt expired") {
              setErrorMsg("Link Expired");
            } else {
              setErrorMsg("Internal Server Error  Please try again later.");
            }
            break;

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
      }
      // if (error.message === "Network Error") {
      //   setErrorMsg("Something Went Wrong Please Try Again");
      // } else if (error.message === "error") {
      //   setErrorMsg(error?.response?.data?.errorMessage);
      // }
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
        url: `${baseUrl}/users/resendConfirmationMail/${userId}`,
      };

      const response = await axios.request(config);

      if (response?.data?.message === "done") {
        setErrorMsg(
          " You should shortly receive an email with the activation link"
        );
      } else {
        // setErrorMsg(false);
        setErrorMsg(response?.data?.message);
      }
      setIsLoading(false);
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
            // setErrorMsg("Internal Server Error  Please try again later.");
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
              <div className=" cont-1 d-flex justify-content-center align-items-center mx-auto  ">
                <div className=" sub-cont w-100">
                  <div className=" text-check ">
                    <div className="  timeline-reg d-flex">
                      <div className="img-cont ms-5">
                        <img src={awaitImg} alt="" />
                      </div>

                      <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                    </div>
                    <p className="text-cont  active">Select Your Role</p>
                  </div>
                  {/*  */}
                  <div className=" text-check ">
                    <div className="  timeline-reg d-flex">
                      <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                      <div className="img-cont">
                        <img src={nextImg} alt="" />
                      </div>

                      <div className="w-100 vertical-line-after mt-auto mb-auto"></div>
                    </div>
                    <p className="text-cont text-center">Company Details</p>
                  </div>
                  {/*  */}
                  {/*  */}
                  <div className=" text-check ">
                    <div className="  timeline-reg d-flex">
                      <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                      <div className="img-cont">
                        <img src={nextImg} alt="" />
                      </div>

                      <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                    </div>
                    <p className="text-cont text-center">
                      Representive Information
                    </p>
                  </div>
                  {/*  */}
                  {/*  */}
                  <div className=" text-check ">
                    <div className="  timeline-reg d-flex">
                      <div className="w-100 vertical-line-after  mt-auto mb-auto"></div>
                      <div className="img-cont me-5">
                        <img src={nextImg} alt="" />
                      </div>
                    </div>
                    <p className="text-cont text-end">Legal documents</p>
                  </div>
                  {/*  */}
                </div>
              </div>
              <div className="sec-div d-flex justify-content-center">
                <div className="frame-container-1 p-5">
                  <div className="cont-frame-1 ">
                    <div className="img-logo w-100">
                      <img src={logo} />
                    </div>

                    <label className="text-title m-auto">Email Activated</label>

                    <p className="text-sub m-auto">
                      Welcome to Egyption fastest-growing B2B platform,
                      connecting buyers and suppliers in the consumer goods
                      industry. Please Sign In to get started.
                    </p>

                    <div className="row gap-row">
                      <div
                        className="col-12 cursor"
                        onClick={() => {
                          navigate("/signIn/userType");
                        }}
                      >
                        <div className="border-type p-3 ">
                          <div className="d-flex justify-content-start align-content-center gap-cont">
                            <div className="user-icon">
                              <img src={userIcon} alt="buyer icon" />
                            </div>
                            <div className="">
                              <p className="user-text cursor">Sign In</p>
                              <p className="text-muted user-text-sub cursor">
                                I want to launch products with trusted suppliers
                                and partners.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center">
                      <small className="text-muted title-small">
                        Already have an account?
                        <span className="fw-bolder"> Sign In</span>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="sec-div d-flex justify-content-center">
              <div className="frame-container-1 p-5">
                <div className="cont-frame-1 ">
                  <div className="img-logo w-100">
                    <img src={logo} alt="logo" />
                  </div>

                  <label className="text-title m-auto">
                    {errorMsg ?? "Expired Link"}
                  </label>

                  <p className="text-sub m-auto">
                    Welcome to Egyption fastest-growing B2B platform, connecting
                    buyers and suppliers in the consumer goods industry. Please
                    choose your preferred account type to get started.
                  </p>

                  <div className="row gap-row">
                    <div className="col-12 action">
                      <form className="w-100" onSubmit={(e) => ReSendToken(e)}>
                        {isLoading ? (
                          <button
                            type="button"
                            className="action-btn btn-1 w-100"
                          >
                            <i className="fas fa-spinner fa-spin text-white"></i>
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

export default EmailActivatedMsg;
