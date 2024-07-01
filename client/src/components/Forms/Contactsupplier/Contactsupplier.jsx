import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
// import { baseUrl, socket } from "config.js";
import { baseUrl } from "config.js";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg/IsLoggedInMsg";

import { useNavigate, useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import Header from "components/main/Header/Header";
import { GlobalMsgContext } from "Context/globalMessage";

function Contactsupplier() {
  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let { setGlobalMsg } = useContext(GlobalMsgContext);

  const [searchParams] = useSearchParams();
  const factoryId = searchParams.get("userId");
  const factoryName = searchParams.get("factoryName");

  const importerId = searchParams.get("importerId");
  const importerName = searchParams.get("importerName");

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);
  let [factoryDetails, setFactoryDetails] = useState({});
  const [modalShow, setModalShow] = useState({
    isLogin: false,
  });

  // factory details
  async function fetchFactoryData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/${currentUserData?.factoryId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.factories);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  async function fetchImporterData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/importers/${currentUserData?.importerId}`,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setFactoryDetails(response.data.importers);
      } else if (response.data.message == "404 Not Found") {
        // errorsMsg("404");
      }
    } catch (error) {}
  }

  // product data
  // ------------------------Form Validation
  let validationSchema = Yup.object().shape({
    message: Yup.string()
      .min(5, "min legnth is 5")
      .required("Input field is Required")
      .max(255, "max legnth is 255"),
  });

  let initialValues = {
    // optional
    reciever: factoryId != null ? factoryId : importerId,
    message: "",
  };
  //

  useEffect(() => {
    if (currentUserData && currentUserData?.userID !== null) {
      formValidation.setValues(initialValues);
    }

    if (currentUserData && currentUserData?.factoryId !== null) {
      fetchFactoryData();
    }
    if (currentUserData && currentUserData?.importerId !== null) {
      fetchImporterData();
    }
  }, [currentUserData]);

  let formValidation = useFormik({
    initialValues,
    validationSchema,
    onSubmit: submitForm,
  });
  async function submitForm(values) {
    setIsLoading(true);
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    let data = {
      messageObj: {
        reciever: values.reciever,
        message: values.message,
        status: "pending",
      },
    };

    try {
      let config = {
        method: "post",
        url: `${baseUrl}/chats/add`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data.message == "done") {
        setGlobalMsg("Your form has been successfully submitted.");
        navigate(-1);
        // socket.on("connect", () => {
        //   console.log("Connected to server");
        // });
        // socket.emit("newMessage", values.message);

        // // Listen for new messages
        // socket.on("newMessage", values.message);
        // socket.on("newMessage", (data) => {
        //   console.log("New message received:", data);
        // });

        // Cleanup on unmount
        // return () => {
        //   socket.off("connect");
        //   socket.off("newMessage");
        // };
        // Track errors
        // socket.on("connect_error", (err) => {
        //   console.error("Connection error:", err);
        // });

        // socket.on("connect_timeout", (err) => {
        //   console.error("Connection timeout:", err);
        // });

        // socket.on("error", (err) => {
        //   console.error("General error:", err);
        // });

        // socket.on("reconnect_error", (err) => {
        //   console.error("Reconnect error:", err);
        // });

        // socket.on("reconnect_failed", () => {
        //   console.error("Reconnect failed");
        // });
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: response?.data?.message,
        }));
        window.scrollTo({ top: 1125.5999755859375 });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      if (error.response && error.response.status) {
        const statusCode = error.response.status;
        switch (statusCode) {
          // case 200:
          //   setErrorMsg("Success (200).");
          //   break;
          // case 204:
          //   setErrorMsg("No Content (204).");
          //   break;
          case 400:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;
          case 401:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: "User is not Unauthorized ",
            }));
            break;
          case 403:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                "Forbidden, You do not have permission to access this resource.",
            }));

            break;
          case 404:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response:
                "Not Found (404). The requested resource was not found.",
            }));

            break;

          case 500:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            break;

          //  429 Too Many Requests
          // The user has sent too many requests in a given amount of time ("rate limiting").
          case 429:
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: " Too Many Requests , Please try again later.",
            }));
            break;
          case 402:
            // 402
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.message,
            }));
            window.scrollTo({ top: 1125.5999755859375 });

            break;
          default:
            window.scrollTo({ top: 1125.5999755859375 });

            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              response: error?.response?.data?.errorMessage,
            }));
            // case message== error
            break;
        }
      } else {
        setErrorMsg((prevErrors) => ({
          ...prevErrors,
          response: "An unexpected error occurred. Please try again later.",
        }));
      }

      window.scrollTo({ top: 1540 });
    }

    // useEffect(() => {
    // Join the chat room or handle the connection

    // }, []);
  }

  useEffect(() => {
    if (!isLogin) {
      setModalShow((prevVal) => ({
        ...prevVal,
        isLogin: true,
      }));

      return;
    }
  }, [currentUserData, navigate]);

  return (
    <>
      <IsLoggedIn
        show={modalShow.isLogin}
        distination={
          factoryName != null
            ? `/signIn/contactsupplier?userId=${factoryId}&factoryName=${factoryName}`
            : `/signIn/contactsupplier?userId=${factoryId}&importerName=${importerName}`
        }
        bgBlur={"bg-blur"}
      />

      <Header title="Contact Supplier" subTitle="Contact Supplier" />
      <section className="send-rfq">
        {/* Factory Details */}
        <div className="container container-rfq ">
          <div className="input-content  ">
            <div className="row row-container w-100 ">
              {/* Factory description */}
              <div className="container container-po ">
                <div className="input-content ">
                  <div className="title-text w-100 ">
                    <h5>Account Inforamtion</h5>
                  </div>

                  {currentUserData?.factoryId !== null && (
                    <div className="row row-container w-100 ">
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Factory Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={factoryDetails?.name || ""}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Role</label>
                          <input
                            type="text"
                            className="form-control text-dark"
                            value="Factory"
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
                            value={`${
                              factoryDetails?.repName == null
                                ? " "
                                : `${factoryDetails?.repName?.[0]}  ${factoryDetails?.repName?.[1]}`
                            }`}
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
                            value={factoryDetails?.repEmail || ""}
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
                            value={factoryDetails?.repPhone || ""}
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
                            value={factoryDetails?.description || ""}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentUserData?.importerId !== null && (
                    <div className="row row-container w-100 ">
                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Representative Name</label>
                          <input
                            type="text"
                            className="form-control text-dark"
                            value={`${
                              factoryDetails?.repName == null
                                ? " "
                                : `${factoryDetails?.repName}`
                            }`}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Role</label>
                          <input
                            type="text"
                            className="form-control text-dark"
                            value="Buyer"
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
                            value={factoryDetails?.repEmail || ""}
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
                            value={factoryDetails?.repPhone || ""}
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
                            value={factoryDetails?.description || ""}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentUserData?.importerId == null &&
                    currentUserData?.factoryId == null && (
                      <div className="row row-container w-100 ">
                        <div className="col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Role</label>
                            <input
                              type="text"
                              className="form-control text-dark"
                              value="Default User"
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
                              value={`${
                                currentUserData?.userEmail == null
                                  ? " "
                                  : `${currentUserData?.userEmail}`
                              }`}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
            {/*  */}
          </div>
        </div>

        <form
          onSubmit={formValidation.handleSubmit}
          autoComplete="off"
          className="w-100"
        >
          <div className="container container-rfq">
            <div className="input-content ">
              {errorMsg?.response ? (
                <div
                  id="errorMsg"
                  className=" alert mt-3 p-2 alert-danger form-control text-dark"
                >
                  {errorMsg?.response}{" "}
                </div>
              ) : (
                ""
              )}

              <div className="row row-container w-100 ">
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="message">message</label>
                    <textarea
                      className="form-control w-100 "
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={formValidation.values.message}
                      id="message"
                      name="message"
                      rows="3"
                      placeholder="enter more details"
                    ></textarea>
                  </div>
                </div>
                {formValidation.errors.message &&
                formValidation.touched.message ? (
                  <small className="form-text text-danger">
                    {formValidation.errors.message}
                  </small>
                ) : (
                  ""
                )}

                <div className="col-12 action ">
                  {isLoading ? (
                    <button type="button" className="action-btn btn-1 w-100 ">
                      <i className="fas fa-spinner fa-spin"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="action-btn btn-1 w-100 submitButton"
                      onClick={() => {
                        if (formValidation.isValid == false) {
                          const targetElement = document.getElementById(
                            Object.keys(formValidation.errors)?.[0]
                          );

                          // Scroll to the target element
                          targetElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }
                      }}
                    >
                      Send
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default Contactsupplier;
