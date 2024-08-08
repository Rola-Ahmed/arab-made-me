import { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { socket } from "config.js";
// import { baseUrl } from "config.js";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";

import { useNavigate, useSearchParams } from "react-router-dom";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import Header from "components/main/Header/Header";
import { GlobalMsgContext } from "Context/globalMessage";
import { addChat } from "Services/chat";
import { fetchOneFactory } from "Services/factory";
import { fetchOneImporter } from "Services/importer";

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
    let result = await fetchOneFactory(currentUserData?.factoryId);

    if (result?.success) {
      setFactoryDetails(result?.data?.factories);
    } else {
      // errorsMsg("404");
    }
  }

  async function fetchImporterData() {
    const result = await fetchOneImporter(currentUserData?.importerId, {});

    if (result?.success) {
      setFactoryDetails(result?.data?.importers);
    } else {
      // errorsMsg("404");
    }
  }

  // product data
  // ------------------------Form Validation
  let validationSchema = Yup.object().shape({
    message: Yup.string()
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

    let result = await addChat(
      {
        authorization: isLogin,
      },
      data
    );

    if (result?.success) {
      socket.emit("socketAuth", isLogin);
      socket.emit("newMessage", data);


      setGlobalMsg("Your form has been successfully submitted.");
      navigate(-1);
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: result?.error,
      }));
      window.scrollTo({ top: 1125.5999755859375 });
    }
    setIsLoading(false);
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

  // Debugging socket connection
  // useEffect(() => {
  //   if (isLogin) {
  //     const connectSocket = () => {
  //       socket.connect();

  //       socket.on("connect", () => {
  //       });

      

  //       socket.on("authorization", (data) => {
  //       });

  //       socket.on("connect_error", (err) => {
  //         console.error("Connection error:", err);
  //       });

  //       socket.on("connect_timeout", (err) => {
  //         console.error("Connection timeout:", err);
  //       });

  //       socket.on("error", (err) => {
  //         console.error("General error:", err);
  //       });

  //       socket.on("reconnect_error", (err) => {
  //         console.error("Reconnect error:", err);
  //       });

  //       socket.on("reconnect_failed", () => {
  //         console.error("Reconnect failed");
  //       });

  //       // Cleanup on unmount
  //       return () => {
  //         // socket.off("connect");
  //         // socket.off("newMessage");
  //         // socket.off("authorization");
  //         // socket.off("connect_error");
  //         // socket.off("connect_timeout");
  //         // socket.off("error");
  //         // socket.off("reconnect_error");
  //         // socket.off("reconnect_failed");
  //         // socket.disconnect();
  //       };
  //     };

  //     connectSocket();

  //     return () => {
  //       // console.log("Disconnecting socket..."); // Debugging message
  //       // socket.disconnect();
  //     };
  //   }
  // }, [isLogin]);

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

      <Header title="Contact Supplier" />
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
                  {errorMsg?.response}
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
