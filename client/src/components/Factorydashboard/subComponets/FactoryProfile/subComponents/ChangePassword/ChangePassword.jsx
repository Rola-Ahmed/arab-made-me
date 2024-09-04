import { useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SuccessToast from "components/SuccessToast";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

// import { GlobalMsgContext } from "Context/globalMessage";

import { passwordValidate } from "utils/validationUtils";
import FormVlaidtionError from "components/Forms/Shared/FormVlaidtionError";
import { updateFromUser } from "Services/UserAuth";

export default function ChangePassword(props) {
  let { errorMsg, clearSession, setErrorMsg, isLogin, isLoading } = props;
  let navigate = useNavigate();
  let [toggleSeePassword, settoggleSeePassword] = useState({
    confirmPassword: false,
    password: false,
    oldPassword: false,
  });

  let [show, setModalPassword] = useState(false);
  const logOuut = () => {
    clearSession();
    navigate("/");
  };

  const submitPasswordForm = async (values) => {
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    // setErrorMsg((prevErrors) => {
    //   const { response, ...restErrors } = prevErrors || {};
    //   return Object.keys(restErrors).length ? JSON.stringify(restErrors) : null;
    // });

    let data = {
      oldPassword: values.oldPassword,
      password: values.password,
    };

    // try {
    let result = await updateFromUser({ authorization: isLogin }, data);

    if (result?.success) {
      logOuut();
      SuccessToast("Password updated Successfully");
    } else {
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        response: result.error,
      }));
    }
  };

  //
  // Password Validation
  let formPasswordValidation = useFormik({
    initialValues: {
      //-------------------- change password
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object().shape({
      oldPassword: passwordValidate,

      password: passwordValidate,
      confirmPassword: Yup.string()
        .required("Input Field is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: submitPasswordForm,
  });

  function handleClose() {
    // setErrorMsg((prevErrors) => {
    //   const { response, ...restErrors } = prevErrors || {};
    //   return restErrors;
    // });

    setModalPassword(false);
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return Object.keys(restErrors).length ? JSON.stringify(restErrors) : null;
    });

    formPasswordValidation.resetForm({
      values: {
        oldPassword: "",
        password: "",
        confirmPassword: "",
      },
      errors: {},
      touched: {},
      status: undefined,
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
    });

    // console.log("changes")
  }
  // console.log("formPasswordValidation",formPasswordValidation)

  return (
    <>
      <div id="PasswordChange"></div>
      <div className="container-profile-input w-100">
        <div className="title-contianer-input w-100">
          <p>Password Change</p>
          <div className="w-100 ">
            <div className="row  row-gap">
              <div className="col-12">
                <div className="form-group">
                  <label>Change Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter New Password"
                    readOnly
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Confirm Password"
                    readOnly
                  />
                </div>
              </div>

              <div className="col-12">
                <Button
                  className="btn-edit"
                  type="button"
                  onClick={() => {
                    setModalPassword(true);
                  }}
                >
                  change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={show == true}
        onHide={() => handleClose()}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="factory-profile"
      >
        <Modal.Body closeButton>
          {/* Account Info container 1 */}

          <div className="container-profile-input w-100">
            <div className="title-contianer-input w-100">
              <Modal.Header closeButton>
                <Modal.Title>
                  <p>Change Password</p>
                </Modal.Title>
              </Modal.Header>
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              )}
              <form
                className="w-100"
                onSubmit={formPasswordValidation.handleSubmit}
              >
                <div className="row  row-gap">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Old Password</label>
                      <div className="input-group">
                        <input
                          type={`${
                            toggleSeePassword.oldPassword == true
                              ? "text"
                              : "password"
                          }`}
                          autoComplete="new-password"
                          className="form-control"
                          id="oldPassword"
                          onChange={formPasswordValidation.handleChange}
                          onBlur={formPasswordValidation.handleBlur}
                          value={formPasswordValidation.values.oldPassword}
                        />
                        <div
                          className="input-group-append cursor"
                          onClick={() =>
                            settoggleSeePassword((prevData) => ({
                              ...prevData,
                              oldPassword: !toggleSeePassword.oldPassword,
                            }))
                          }
                        >
                          <span
                            className={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
                              toggleSeePassword.oldPassword == true
                                ? "fa-solid fa-eye-slash"
                                : "fa-solid fa-eye"
                            }`}
                          ></span>
                        </div>
                      </div>
                      <FormVlaidtionError
                        formValidation={formPasswordValidation}
                        vlaidationName="oldPassword"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Change Password</label>

                      {/*  */}
                      <div className="input-group">
                        <input
                          type={`${
                            toggleSeePassword.password == true
                              ? "text"
                              : "password"
                          }`}
                          className="form-control"
                          id="password"
                          placeholder="Change Password"
                          onChange={formPasswordValidation.handleChange}
                          onBlur={formPasswordValidation.handleBlur}
                          value={formPasswordValidation.values.password}
                          autoComplete="new-passowrd"
                        />
                        <div
                          className="input-group-append cursor"
                          onClick={() =>
                            settoggleSeePassword((prevData) => ({
                              ...prevData,
                              password: !toggleSeePassword.password,
                            }))
                          }
                        >
                          <span
                            className={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
                              toggleSeePassword.password == true
                                ? "fa-solid fa-eye-slash"
                                : "fa-solid fa-eye"
                            }`}
                          ></span>
                        </div>
                      </div>
                      {/*  */}

                      <FormVlaidtionError
                        formValidation={formPasswordValidation}
                        vlaidationName="password"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Confirm Password</label>

                      {/*  */}
                      <div className="input-group">
                        <input
                          type={`${
                            toggleSeePassword.confirmPassword == true
                              ? "text"
                              : "password"
                          }`}
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          onChange={formPasswordValidation.handleChange}
                          onBlur={formPasswordValidation.handleBlur}
                          value={formPasswordValidation.values.confirmPassword}
                        />
                        <div
                          className="input-group-append cursor"
                          onClick={() =>
                            settoggleSeePassword((prevData) => ({
                              ...prevData,
                              confirmPassword: !toggleSeePassword.confirmPassword,
                            }))
                          }
                        >
                          <span
                            className={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
                              toggleSeePassword.confirmPassword == true
                                ? "fa-solid fa-eye-slash"
                                : "fa-solid fa-eye"
                            }`}
                          ></span>
                        </div>
                      </div>
                      {/*  */}

                      <FormVlaidtionError
                        formValidation={formPasswordValidation}
                        vlaidationName="confirmPassword"
                      />
                    </div>
                  </div>

                  <div className="col-12 d-flex justify-content-start btn-modal-gap mt-3">
                    <Button
                      variant="secondary"
                      type="button"
                      aria-label="Close"
                      data-bs-dismiss="modal"
                      onClick={() => handleClose()}
                    >
                      Close
                    </Button>
                    {isLoading ? (
                      <button type="button" className="btn-edit">
                        <i className="fas fa-spinner fa-spin text-white px-5"></i>
                      </button>
                    ) : (
                      <button
                        className="btn-edit submitButton "
                        type="submit"
                        disabled={
                          !(
                            formPasswordValidation.isValid &&
                            formPasswordValidation.dirty
                          )
                        }
                      >
                        <p className="cursor">save changes</p>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
