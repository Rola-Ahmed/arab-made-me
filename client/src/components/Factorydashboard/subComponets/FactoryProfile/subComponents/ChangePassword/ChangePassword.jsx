import { useState } from "react";

import Button from "react-bootstrap/Button";
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
  // once use update the password i should let log him out again
  const logOuut = () => {
    clearSession();
    navigate("/");
  };

  const submitPasswordForm = async (values) => {
    // setErrorMsg((prevErrors) => {
    //   const { response, ...restErrors } = prevErrors || {};
    //   return restErrors;
    // });


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
                <button
                  className="btn-edit"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#changePassword"
                >
                  <p className="cursor">Change Password </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade "
        id="changePassword"
        tabindex="-1"
        role="dialog"
        // aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          class="modal-dialog  modal-dialog-centered modal-lg rounded-3"
          role="document"
        >
          <div class="modal-content   px-4 py-4">
            <div class="modal-header mb-3">
              <h4 class="modal-title fw-normal">
                {/* <h4 class="modal-title fw-normal" id="exampleModalLabel"> */}
                Change Password
              </h4>
              <button
                type="button"
                class="close bg-0 border-0"
                data-dismiss="modal"
                aria-label="Close"
                data-bs-dismiss="modal"
                onClick={() => handleClose()}
              >
                <i class="fa-solid fa-xmark fs-24"></i>
              </button>
            </div>
            <div class="modal-body p-0 ">
              {" "}
              {errorMsg?.response && (
                <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                  {errorMsg?.response}
                </div>
              )}
              {/* <div className="w-100  "> */}
              <form
                className="w-100"
                onSubmit={formPasswordValidation.handleSubmit}
              >
                <div className="row  row-gap">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Old Password</label>
                      <div class="input-group">
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
                          class="input-group-append cursor"
                          onClick={() =>
                            settoggleSeePassword((prevData) => ({
                              ...prevData,
                              oldPassword: !toggleSeePassword.oldPassword,
                            }))
                          }
                        >
                          <span
                            class={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
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
                      <div class="input-group">
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
                          class="input-group-append cursor"
                          onClick={() =>
                            settoggleSeePassword((prevData) => ({
                              ...prevData,
                              password: !toggleSeePassword.password,
                            }))
                          }
                        >
                          <span
                            class={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
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
                      <div class="input-group">
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
                          class="input-group-append cursor"
                          onClick={() =>
                            settoggleSeePassword((prevData) => ({
                              ...prevData,
                              confirmPassword: !toggleSeePassword.confirmPassword,
                            }))
                          }
                        >
                          <span
                            class={`input-group-text bg-white h-100 icon-eye-passowrd    cursor ${
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
                      data-dismiss="modal"
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
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
